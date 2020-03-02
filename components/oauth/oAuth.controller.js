var Sequelize = require('sequelize'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');;

const usersRepo = require('./../users/users.repository'),
    { JWT_SECRET, JWT_EXPIRATION } = require('./../../infrastructure/config');

module.exports.issueToken = async (req, res) => {

    let current = Math.floor(Date.now() / 1000);

    let payLoad = {
      "aud": "1",
      "iat": current,
      "nbf": current,
      "exp": parseInt(current) + parseInt(JWT_EXPIRATION),
      "sub": req.body.id
    }

    let token = jwt.sign(payLoad, JWT_SECRET);

    let refreshPayLoad ={
        "aud": "1",
        "id": req.body.id,
        "token" : bcrypt.hashSync((JWT_EXPIRATION + req.body.id + JWT_SECRET), 10),
        "iat": current,
        "nbf": parseInt(current) + parseInt(JWT_EXPIRATION),
        "exp": parseInt((parseInt(current) + parseInt(JWT_EXPIRATION))) + parseInt(JWT_EXPIRATION)

    };

    let refreshToken = jwt.sign(refreshPayLoad, JWT_SECRET);

    return res.status(200).send({accessToken: token, refresh_token : refreshToken});
};