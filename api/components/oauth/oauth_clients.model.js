const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('oauth_clients', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    secret: {
      type: DataTypes.STRING(35),
      allowNull: false
    }
  },{
    timestamps: false
  });
};