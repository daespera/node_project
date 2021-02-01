var Sequelize = require('sequelize'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');;

const usersRepo = require('./../users/users.repository'),
    { JWT_SECRET, JWT_EXPIRATION } = require('./../../infrastructure/config');

module.exports = {
  issueToken: async (req, res) => {
    let current = Math.floor(Date.now() / 1000),
    payLoad = {
      "aud": req.body.client_id,
      "iat": current,
      "nbf": current,
      "exp": parseInt(current) + parseInt(JWT_EXPIRATION),
    },
    refreshPayLoad ={
      "aud": req.body.client_id,
      "token" : bcrypt.hashSync((JWT_EXPIRATION + req.body.id + JWT_SECRET), 10),
      "iat": current,
      "nbf": parseInt(current),
      "exp": parseInt((parseInt(current) + parseInt(JWT_EXPIRATION))) + parseInt(JWT_EXPIRATION)

    };
    if (req.body.id != undefined){
      let acl = {};
      req.body.user_attributes.map((user,key) => {
        let pattern = /^ACL_/i,
        entry = {[user.attribute]: user.value};
        pattern.test(user.attribute) && (acl = {...acl,  ...entry});
      });
      payLoad.sub = req.body.id;
      payLoad.user_type = req.body.type;
      payLoad.acl = acl;
      refreshPayLoad.id = req.body.id;
    }
    let token = jwt.sign(payLoad, JWT_SECRET),
    refreshToken = req.body.id == undefined ? null : jwt.sign(refreshPayLoad, JWT_SECRET);
    response = {
      token_type : "Bearer",
      expires_at : payLoad.exp,
      accessToken: token
    };
    if(refreshToken != null)
      response.refresh_token = refreshToken;
    return res.status(200).send(response);
  }
}