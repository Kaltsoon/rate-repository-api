import Koa from 'koa';
import cors from '@koa/cors';
import morgan from 'koa-morgan';
import bodyParser from 'koa-bodyparser';
import { ApolloServer, toApolloError, ApolloError } from 'apollo-server-koa';
import { ValidationError } from 'yup';
import Router from 'koa-router';
import through from 'through2';

import { ApplicationError, NotFoundError } from './errors';
import AuthService from './utils/authService';
import createDataLoaders from './utils/createDataLoaders';
import logger from './utils/logger';
import api from './api';
import schema from './graphql/schema';

const logStream = through(chunk => {
  logger.info(chunk.toString());
});

const errorHandler = () => async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    const normalizedError =
      e instanceof ApplicationError
        ? e
        : new ApplicationError('Something went wrong');

    ctx.status = normalizedError.status || 500;
    ctx.body = normalizedError;

    logger.error(e, { path: ctx.request.path });
  }
};

const apolloErrorFormatter = error => {
  logger.error(error);

  const { originalError } = error;
  const isGraphQLError = !(originalError instanceof Error);

  let normalizedError = new ApolloError(
    'Something went wrong',
    'INTERNAL_SERVER_ERROR',
  );

  if (originalError instanceof ValidationError) {
    normalizedError = toApolloError(error, 'BAD_USER_INPUT');
  } else if (error.originalError instanceof ApolloError || isGraphQLError) {
    normalizedError = error;
  }

  return normalizedError;
};

const app = new Koa();

const apolloServer = new ApolloServer({
  schema,
  playground: true,
  introspection: true,
  formatError: apolloErrorFormatter,
  context: ({ ctx }) => {
    const authorization = ctx.request.get('authorization');

    const accessToken = authorization ? authorization.split(' ')[1] : undefined;
    const dataLoaders = createDataLoaders();

    return {
      authService: new AuthService({
        accessToken,
        dataLoaders,
      }),
      dataLoaders,
    };
  },
});

app.use(bodyParser());
app.use(errorHandler());

app.use(morgan('combined', { stream: logStream }));

app.use(async (ctx, next) => {
  ctx.dataLoaders = createDataLoaders();
  await next();
});

app.use(cors());

const apiRouter = new Router();

apiRouter.use('/api', api.routes());

app.use(apiRouter.routes());

apolloServer.applyMiddleware({ app });

app.use(ctx => {
  throw new NotFoundError(`The path "${ctx.request.path}" is not found`);
});

export default app;
