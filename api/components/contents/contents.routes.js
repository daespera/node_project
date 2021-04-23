const ContentsController = require('./contents.controller'),
OAuthMiddleware = require('./../oauth/oAuth.middleware'),
{ validate, Joi } = require('express-validation');

exports.routesConfig = (app) => {
  const createValidation = {
    body: Joi.object({
      id: Joi.string()
        .optional(),
      type: Joi.string()
        .valid('BLOG', 'CONTENT')
        .required(),
      title: Joi.string()
        .required(),
      slug: Joi.string()
        .required(),
      content: Joi.string()
        .required(),
      status: Joi.string()
        .valid('','ACTIVE', 'BLOCKED', 'DISABLED')
        .optional(),
    }),
  }

  const fetchValidation = {
    query: Joi.object({
      page: Joi.number()
        .integer()
        .positive(),
      size: Joi.number()
        .integer()
        .positive(),
      where: Joi.string().pattern(/[{\[]{1}([,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|".*?")+[}\]]{1}/),
    }),
  }

  const updateValidation = {
    body: Joi.object({
      id: Joi.string()
        .optional(),
      type: Joi.string()
        .valid('BLOG', 'CONTENT')
        .optional(),
      title: Joi.string()
        .optional(),
      slug: Joi.string()
        .optional(),
      content: Joi.string()
        .optional(),
      status: Joi.string()
        .valid('','ACTIVE', 'BLOCKED', 'DISABLED')
        .optional(),
    }),
  }

  app.post('/api/v1/content', [
    OAuthMiddleware.validJWTNeeded,
    validate(createValidation, { keyByField: true }, {abortEarly: false}),
    //OAuthMiddleware.hasACL("ACL_CONTENT_ADD"),
    ContentsController.insert
  ]);

  app.get('/api/v1/content/:_id?', [
    OAuthMiddleware.validJWTNeeded,
    validate(fetchValidation, { keyByField: true }, {abortEarly: false}),
    //OAuthMiddleware.hasACL("ACL_CONTENT_RETRIEVE"),
    ContentsController.list
  ]);

  app.put('/api/v1/content/:_id', [
    OAuthMiddleware.validJWTNeeded,
    validate(updateValidation, { keyByField: true }, {abortEarly: false}),
    //OAuthMiddleware.hasACL("ACL_CONTENT_EDIT"),
    ContentsController.edit
  ]);
};