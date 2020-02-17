require('dotenv').config();

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: process.env.DATABASE_FILENAME,
  },
  useNullAsDefault: true,
  seeds: {
    direcotry: './seeds',
  },
};
