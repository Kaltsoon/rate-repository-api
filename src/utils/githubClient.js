import LRUCache from 'lru-cache';

const oneHour = 1000 * 60 * 60;

class GithubClient {
  constructor({ httpClient, cacheMaxAge = oneHour, clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.httpClient = httpClient;
    this.cache = new LRUCache({ max: 100, maxAge: cacheMaxAge });
  }

  async getRequest(url, options = {}) {
    const auth =
      this.clientId && this.clientSecret
        ? {
            username: this.clientId,
            password: this.clientSecret,
          }
        : undefined;

    return this.httpClient.get(url, {
      ...options,
      auth,
    });
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

  getRepository(username, repository) {
    return this.getRequestWithCache(
      `repository.${username}.${repository}`,
      `/repos/${username}/${repository}`,
    );
  }
}

const createGithubClient = options => new GithubClient(options);

export default createGithubClient;
