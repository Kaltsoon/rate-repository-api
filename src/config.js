import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export default {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  database: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(
        __dirname,
        '..',
        process.env.DATABASE_FILENAME || 'database.sqlite',
      ),
    },
    useNullAsDefault: true,
  },
  github: {
    apiUrl: process.env.GITHUB_API_URL,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
};
