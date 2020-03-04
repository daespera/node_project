const OAuthController = require('./oAuth.controller'),
    OAuthMiddleware = require('./oAuth.middleware');

exports.routesConfig = function (app) {

    app.post('/api/v1/oauth/token', [
        OAuthMiddleware.validateUser,
        OAuthController.issueToken
    ]);

};