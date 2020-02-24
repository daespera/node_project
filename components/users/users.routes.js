const UsersController = require('./users.controller');

exports.routesConfig = function (app) {
    app.post('/users', [
        UsersController.insert
    ]);

    app.get('/users/:_id?', [
        UsersController.list
    ]);

    app.put('/users/:_id', [
        UsersController.edit
    ]);

    app.delete('/users/:_id', [
        UsersController.delete
    ]);
};