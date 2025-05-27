const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Airport = sequelize.define('Airport', {
  name:     { type: DataTypes.STRING, allowNull: false },
  code:     { type: DataTypes.STRING, allowNull: false, unique: true }, // IATA код должен быть уникальным
  city:     { type: DataTypes.STRING, allowNull: false },
  country:  { type: DataTypes.STRING, allowNull: false }
});

module.exports = Airport;
