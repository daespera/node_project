const UsersController = require('./users.controller'),
    OAuthMiddleware = require('./../oauth/oAuth.middleware');

exports.routesConfig = function (app) {
    app.post('/users', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.insert
    ]);

    app.get('/users/:_id?', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.list
    ]);

    app.put('/users/:_id', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.edit
    ]);

    app.delete('/users/:_id', [
        OAuthMiddleware.validJWTNeeded,
        UsersController.delete
    ]);
};