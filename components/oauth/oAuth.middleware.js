var Sequelize = require('sequelize'),
    model;

const usersRepo = require('./../users/users.repository');

module.exports.validateUser = async (req, res, next) => {
    let user =  await usersRepo.model().findOne({
        where: {
            email: req.body.user
        }
    });
    if(!await user.validatePassword(req.body.password)){
        res.status(400);
        return res.send({
            message: "Inavalid credentials."
        });
    }

    req.body = {
        userId: user.id,
        email: user.email,
        provider: 'email',
        name: user.first_name + ' ' + user.last_name
    };
    return next();
};