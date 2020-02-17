import axios from 'axios';
import knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

import createLogger from './utils/logger';
import createGithubClient from './utils/githubClient';
import bindModels from './models';

const createContext = ({ config }) => {
  const db = knex({
    ...config.database,
    ...knexSnakeCaseMappers(),
  });

  return {
    db,
    models: bindModels(db),
    logger: createLogger(),
    githubClient: createGithubClient({
      httpClient: axios.create({
        baseURL: config.github.apiUrl,
      }),
      clientId: config.github.clientId,
      clientSecret: config.github.clientSecret,
    }),
  };
};

export default createContext;
