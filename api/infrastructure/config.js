const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  DB_DATABASE: process.env.SQLZ_DB_DATABASE,
  DB_USER: process.env.SQLZ_DB_USER,
  DB_PASSWORD: process.env.SQLZ_DB_PASSWORD,
  DB_HOST: process.env.SQLZ_DB_HOST,
  DB_PORT: process.env.SQLZ_DB_PORT,
  DB_TYPE: process.env.SQLZ_DB_TYPE,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION,
  API_BASE_URL: process.env.API_BASE_URL
};