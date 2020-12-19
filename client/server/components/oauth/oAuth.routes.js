const OAuthController = require('./oAuth.controller'),
    OAuthMiddleware = require('./oAuth.middleware'),
    { validate, Joi } = require('express-validation');

exports.routesConfig = function (app) {

	const loginValidation = {
	  body: Joi.object({
	  	grant_type: Joi.string()
	      .required(),
		client_id: Joi.string()
	      .required(),
		secret: Joi.string()
	      .required(),
	    user: Joi.string()
	      .email()
	      .required(),
	    password: Joi.string()
	      .regex(/[a-zA-Z0-9]{3,30}/)
	      .required(),
	  }),
	}

    app.post('/api/v1/oauth/token', [
    	validate(loginValidation, { keyByField: true }, {abortEarly: false}),
        OAuthMiddleware.validateUser,
        OAuthController.issueToken,
    ]);

};