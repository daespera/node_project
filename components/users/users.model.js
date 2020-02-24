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
            allowNull: false,
            unique: true
        },
        last_name: {
            type: DataTypes.STRING(35),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(35),
            allowNull: false,
            unique: true
        }
    },{
        paranoid: true,
        deletedAt: 'deleted_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return User;
};