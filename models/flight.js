// Определение модели Рейс (Flight)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Flight = sequelize.define('Flight', {
  flightNumber: { type: DataTypes.STRING, allowNull: false },
  departureTime: { type: DataTypes.DATE, allowNull: false },
  arrivalTime: { type: DataTypes.DATE, allowNull: false }
});

module.exports = Flight;
