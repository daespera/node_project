const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(35),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM({
              values: ['ADMIN', 'SUPER_USER', 'USER']
            }),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(35),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },{
        paranoid: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ["email"]
            }
        ],
        hooks: {
            beforeCreate: function(user, options, fn) {
                user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
            },
            beforeUpdate: function(user, options, fn) {
                user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
            }
        }
    });

    User.prototype.toJSON =  function () {
        var values = Object.assign({}, this.get());

        delete values.password;
        return values;
    }

    User.prototype.validatePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    return User;
};