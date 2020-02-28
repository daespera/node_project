var Sequelize = require('sequelize'),
    jwt = require('jsonwebtoken');

const usersRepo = require('./../users/users.repository'),
    { JWT_SECRET, JWT_EXPIRATION } = require('./../../infrastructure/config');

module.exports.issueToken = async (req, res) => {

    let token = jwt.sign(req.body, JWT_SECRET);

    res.status(201).send({accessToken: token});
};