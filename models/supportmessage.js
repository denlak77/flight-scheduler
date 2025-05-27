const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupportMessage = sequelize.define('SupportMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reply: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open'
  }
});

SupportMessage.associate = (models) => {
  SupportMessage.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = SupportMessage; 