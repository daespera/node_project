const Sequelize = require('sequelize'),
jwt = require('jsonwebtoken'),
clientModel = () => {
    return sequelize['import']('./oauth_clients.model.js');
},
usersRepo = require('./../users/users.repository'),
bcrypt = require('bcrypt'),
{ JWT_SECRET, JWT_EXPIRATION } = require('./../../infrastructure/config'),
getClient = async (id,secret) => {
  let client =  await clientModel().findOne({
    where: {
      id: id,
      secret: secret
    }
  });
  return await client == null ? null : {clientid : client.id};
},
grantType = {
  client_credentials:  async (params) => {
    return await getClient(params.client_id, params.secret);
  },
  password:  async (params) => {
    let client =  await getClient(params.client_id, params.secret);
    if (client == null)
        return await null;
    let user =  await usersRepo.model().findOne({
      where: {
        email: params.user
      },
      include: [
        "user_attributes"
      ]
    });
    if(!await user.validatePassword(params.password)){
      return await null;
    }
    user.clientid = client.clientid;
    return await user;
  },
  refresh_token:  async (params) => {
    let decoded =  await jwt.verify(params.token, JWT_SECRET, function (err, decoded) {
      return decoded;
    });
    if (decoded == undefined)
      return await null;
    let match = await bcrypt.compare((JWT_EXPIRATION + decoded.id + JWT_SECRET), decoded.token);
    if(match)
      return await usersRepo.model().findOne({
        where: {
          id: decoded.id
        }
      });
    else
      return await null;
  }
};
module.exports = {
  validateUser: async (req, res, next) => {
    if(grantType[req.body.grant_type] == undefined){
      return res.status(400).send({
        name: "ValidationError",
        message: "Invalid grant type.",
        statusCode: 400,
        error: "Bad Request",
        details: [
          {
            grant_type: "Invalid grant type."
          }
        ]
      });
    }
    let user = await grantType[req.body.grant_type](req.body);
    if(user == null){
      return res.status(400).send({
        name: "ValidationError",
        message: "Invalid credentials.",
        statusCode: 400,
        error: "Bad Request",
        details: [
          {
            credentials: "Invalid credentials."
          }
       ]
      });
    }
    req.body = {
      client_id: user.clientid,
      id: user.id,
      type: user.type,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      user_attributes: user.user_attributes
    };
    return next();
  },
  validJWTNeeded: (req, res, next) => {
    if (req.headers['authorization']) {
      try {
        let authorization = req.headers['authorization'].split(' ');
        if (authorization[0] !== 'Bearer') {
          return res.status(401).send({
            name: "ValidationError",
            message: "Invalid credentials.",
            statusCode: 401,
            error: "Bad Request",
            details: [
              {
                credentials: "Invalid credentials."
              }
            ]
          });
        } else {
          req.jwt = jwt.verify(authorization[1], JWT_SECRET);
          return next();
        }
      } catch (err) {
        return res.status(403).send({
          name: "ValidationError",
          message: "Invalid credentials.",
          statusCode: 403,
          error: "Bad Request",
          details: [
            {
              credentials: "Invalid credentials."
            }
          ]
        });
      }
    } else {
      return res.status(401).send({
          name: "ValidationError",
          message: "Invalid credentials.",
          statusCode: 401,
          error: "Bad Request",
          details: [
            {
              credentials: "Invalid credentials."
            }
          ]
      });
    }
  },
  hasACL: acl => {
    return (req, res, next) => {
      if(req.jwt.acl[acl] == undefined)
        return res.status(401).send({
          name: "ACLError",
          message: "Permission denied.",
          statusCode: 401,
          error: "Bad Request",
          details: [
            {
              credentials: "Permission denied."
            }
          ]
        });
      next();
    }
  }
};