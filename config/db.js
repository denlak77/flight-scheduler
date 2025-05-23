const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'database',
  process.env.DB_USER || 'username',
  process.env.DB_PASS || 'password', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
