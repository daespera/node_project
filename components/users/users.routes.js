const UsersController = require('./users.controller');

exports.routesConfig = function (app) {
    app.post('/users', [
        UsersController.insert
    ]);

    app.get('/users/:_id?', [
        UsersController.list
    ]);
};