const OAuthController = require('./oAuth.controller'),
    OAuthMiddleware = require('./oAuth.middleware');

exports.routesConfig = function (app) {

    app.post('/oauth/token', [
        OAuthMiddleware.validateUser,
        OAuthController.issueToken
    ]);

};