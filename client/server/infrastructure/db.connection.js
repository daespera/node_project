const { 
    DB_DATABASE,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_TYPE
} = require('./config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(DB_DATABASE, 
    DB_USER, 
    DB_PASSWORD, {
        host: DB_HOST,
        dialect: DB_TYPE,
        port: DB_PORT
});

module.exports = sequelize;
global.sequelize = sequelize;