const UsersController = require('./users.controller'),
    OAuthMiddleware = require('./../oauth/oAuth.middleware');

exports.routesConfig = function (app) {
    app.post('/api/v1/users', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.insert
    ]);

    app.get('/api/v1/users/:_id?', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.list
    ]);

    app.put('/api/v1/users/:_id', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.edit
    ]);

    app.delete('/api/v1/users/:_id', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.delete
    ]);
};