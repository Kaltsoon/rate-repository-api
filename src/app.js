import Koa from 'koa';
import cors from '@koa/cors';
import morgan from 'koa-morgan';
import bodyParser from 'koa-bodyparser';
import { ApolloServer, toApolloError, ApolloError } from 'apollo-server-koa';
import { ValidationError } from 'yup';
import Router from 'koa-router';

import { ApplicationError, NotFoundError } from './errors';
import createAuthService from './utils/authService';
import createDataLoaders from './utils/dataLoaders';
import api from './api';

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

    ctx.logger.error(e, { path: ctx.request.path });
  }
};

const createApolloErrorFormatter = logger => {
  return error => {
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
};

export default ({ logStream, context, schema, config } = {}) => {
  const app = new Koa();

  const apolloServer = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    formatError: createApolloErrorFormatter(context.logger),
    context: ({ ctx }) => {
      const authorization = ctx.request.get('authorization');

      const accessToken = authorization
        ? authorization.split(' ')[1]
        : undefined;

      return {
        ...context,
        authService: createAuthService({
          accessToken,
          jwtSecret: config.jwtSecret,
        }),
        dataLoaders: createDataLoaders({ models: context.models }),
      };
    },
  });

  app.context = Object.assign(app.context, context);

  app.use(bodyParser());
  app.use(errorHandler());

  if (logStream) {
    app.use(morgan('combined', { stream: logStream }));
  }

  app.use(async (ctx, next) => {
    ctx.dataLoaders = createDataLoaders({ models: context.models });
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

  return app;
};
