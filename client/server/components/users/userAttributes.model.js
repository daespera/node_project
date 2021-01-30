module.exports = function (sequelize, DataTypes) {
  var UserAttribute = sequelize.define('user_attributes', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    attribute: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(35),
      allowNull: true
    },
  },{
    timestamps: false,
    indexes: [
      {
        name: 'attributes_by_user',
        fields: ["userId","attribute"]
      }
    ],
    hooks: {
      beforeBulkCreate: (UserAttributes, options, fn) => {
        for (const UserAttribute of UserAttributes) {
          const {
            userId,
            attribute
          } = UserAttribute;
          UserAttribute.setDataValue("id", (userId+'-'+attribute));
        }
      }
    }
  });
  UserAttribute.associate = function(models) {
    UserAttribute.belongsTo(models.User, {foreignKey: 'userId', as: 'user'})
  };

  return UserAttribute;
};