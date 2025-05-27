const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Airline = sequelize.define('Airline', {
  name:        { type: DataTypes.STRING,  allowNull: false },
  code:        { type: DataTypes.STRING,  allowNull: false }, // IATA
  country:     { type: DataTypes.STRING,  allowNull: true  }
});

module.exports = Airline;
