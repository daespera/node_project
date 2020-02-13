const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_TYPE: process.env.DB_TYPE,
    PORT: process.env.PORT
};