const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticket = sequelize.define('Ticket', {
  seatNumber:  { type: DataTypes.STRING, allowNull: true },
  bookingTime: { type: DataTypes.DATE,   allowNull: false, defaultValue: DataTypes.NOW },
  status:      { type: DataTypes.ENUM('booked','cancelled','checked-in'), allowNull: false, defaultValue: 'booked' }
});

module.exports = Ticket;
