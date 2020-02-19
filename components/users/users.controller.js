var Sequelize = require('sequelize'),
    model;
//const UsersRepo = require('./users.repository');
//const usersRepo = new UsersRepo();
const usersRepo = require('./users.repository');

module.exports = {
   ...require('../../infrastructure/base.controller')(usersRepo),
};

module.exports.test = (req, res) => {
        return res.send({
                message: req.params._id
            });
};