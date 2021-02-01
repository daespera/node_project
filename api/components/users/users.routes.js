const UsersController = require('./users.controller'),
OAuthMiddleware = require('./../oauth/oAuth.middleware'),
UsershMiddleware = require('./users.middleware'),
{ validate, Joi } = require('express-validation');

exports.routesConfig = (app) => {
  const createValidation = {
    body: Joi.object({
      first_name: Joi.string()
        .required(),
      last_name: Joi.string()
        .required(),
      email: Joi.string()
          .email()
        .required(),
      type: Joi.string()
          .valid('ADMIN', 'SUPER_USER', 'USER')
        .required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  }

  app.post('/api/v1/user', [
    validate(createValidation, { keyByField: true }, {abortEarly: false}),
    OAuthMiddleware.validJWTNeeded,
    OAuthMiddleware.hasACL("ACL_USER_ADD"),
    UsersController.insert
  ]);

  app.get('/api/v1/user/:_id?', [
    OAuthMiddleware.validJWTNeeded,
    OAuthMiddleware.hasACL("ACL_USER_RETRIEVE"),
    UsersController.list
  ]);

  app.put('/api/v1/user/:_id', [
    OAuthMiddleware.validJWTNeeded,
    OAuthMiddleware.hasACL("ACL_USER_EDIT"),
    UsersController.edit
  ]);

  app.delete('/api/v1/user/:_id', [
    OAuthMiddleware.validJWTNeeded,
    OAuthMiddleware.hasACL("ACL_USER_DELETE"),
    UsersController.delete
  ]);

  app.put('/api/v1/user/:_id/user_attribute', [
    OAuthMiddleware.validJWTNeeded,
    UsersController.createAttribute
  ]);
};