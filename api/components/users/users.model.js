const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const UserAttribute = sequelize.import('./userAttributes.model'),
  User = sequelize.define('user', {
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
  status: {
      type: DataTypes.ENUM({
        values: ['ACTIVE', 'BLOCKED', 'DISABLED']
      }),
      defaultValue: 'ACTIVE',
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(35),
      allowNull: false,
      unique:  {
        args: true,
        msg: 'Email address already in use!'
      }
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
      beforeCreate: (user, options, fn) => {
          user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
      },
      beforeUpdate: (user, options, fn) => {
          user.password = user.password && user.password != "" ? bcrypt.hashSync(user.password, 10) : "";
      }
    }
  });

  User.prototype.toJSON = function () {
    let values = Object.assign({}, this.get()),
      attributes = {};
    if(values.user_attributes && values.user_attributes.length){
      values.user_attributes.map((attribute,key) =>{
        let temp = {[attribute.attribute] : attribute.value};
        attributes = {...attributes, ...temp}
      });
    }
    values.user_attributes = attributes;
      
    delete values.password;
    return values;
  }

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.hasMany(UserAttribute, { as: 'user_attributes' });
  
  return User;
};