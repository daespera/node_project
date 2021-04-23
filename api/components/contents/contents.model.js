module.exports = (sequelize, DataTypes) => {
  const Content = sequelize.define('content', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM({
        values: ['BLOG', 'CONTENT']
      }),
      defaultValue: 'BLOG',
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(35),
      allowNull: false,
      unique:  {
        args: true,
        msg: 'slug already in use!'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM({
        values: ['ACTIVE', 'BLOCKED', 'DISABLED']
      }),
      defaultValue: 'DISABLED',
      allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,             
      get() {
            return new Date (this.getDataValue('created_at')).toLocaleString("sv-SE");
        }
    },
  },{
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: (content, options, fn) => {
        content.status = content.status && content.status != "" ? content.status : "DISABLED";
      }
    }
  });

  Content.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    return values;
  }
  return Content;
};