require('dotenv').config();

const FILENAME = process.env.DATABASE_FILENAME || 'database.sqlite';

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: FILENAME,
  },
  useNullAsDefault: true,
};
