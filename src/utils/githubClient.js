import LRUCache from 'lru-cache';
import { ApolloError } from 'apollo-server';
import { pick, get } from 'lodash';

const oneHour = 1000 * 60 * 60;

const HTTP_CLIENT_ERROR = Symbol();

const isNotFoundError = error =>
  get(error[HTTP_CLIENT_ERROR], 'response.status') === 404;

class GithubError extends ApolloError {
  constructor(message, properties) {
    super(message, 'GITHUB_API_FAILURE', properties);
  }

  static fromHttpClientError(error) {
    const githubError = new GithubError('GitHub API request failed', {
      response: pick(error.response, [
        'status',
        'statusText',
        'headers',
        'data',
      ]),
    });

    githubError[HTTP_CLIENT_ERROR] = error;

    return githubError;
  }
}

export class GithubRepositoryNotFoundError extends ApolloError {
  constructor(message, properties) {
    super(message, 'GITHUB_REPOSITORY_NOT_FOUND', properties);
  }

  static fromNames(ownerName, repositoryName) {
    return new GithubRepositoryNotFoundError(
      `GitHub repository ${repositoryName} owned by ${ownerName} does not exists`,
      { ownerName, repositoryName },
    );
  }
}

class GithubClient {
  constructor({ httpClient, cacheMaxAge = oneHour, clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.httpClient = httpClient;
    this.cache = new LRUCache({ max: 100, maxAge: cacheMaxAge });
  }

  getAuth() {
    return this.clientId && this.clientSecret
      ? {
          username: this.clientId,
          password: this.clientSecret,
        }
      : undefined;
  }

  async getRequest(url, options = {}) {
    try {
      const response = await this.httpClient.get(url, {
        ...options,
        auth: this.getAuth(),
      });

      return response;
    } catch (error) {
      throw GithubError.fromHttpClientError(error);
    }
  }

  async getRequestWithCache(cacheKey, url, options) {
    const cachedPromise = this.cache.get(cacheKey);

    if (cachedPromise) {
      const { data } = await cachedPromise;

      return data;
    }

    const promise = this.getRequest(url, options);

    this.cache.set(cacheKey, promise);

    try {
      const { data } = await promise;

      return data;
    } catch (e) {
      this.cache.del(cacheKey);

      throw e;
    }
  }

  async getRepository(username, repository) {
    try {
      const data = await this.getRequestWithCache(
        `repository.${username}.${repository}`,
        `/repos/${username}/${repository}`,
      );

      return data;
    } catch (error) {
      if (isNotFoundError(error)) {
        return null;
      }

      throw error;
    }
  }
}

const createGithubClient = options => new GithubClient(options);

export default createGithubClient;
