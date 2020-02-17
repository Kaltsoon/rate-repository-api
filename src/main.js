import through from 'through2';
import http from 'http';

import createApp from './app';
import createContext from './context';
import createSchema from './graphql/schema';
import config from './config';

const context = createContext({ config });
const schema = createSchema();
const { logger } = context;

const logStream = through(chunk => {
  logger.info(chunk.toString());
});

const app = createApp({ schema, context, logStream, config });

const server = http.createServer(app.callback()).listen(config.port);

server.on('listening', () => {
  logger.info(`Server listening to port ${config.port}`);
});
