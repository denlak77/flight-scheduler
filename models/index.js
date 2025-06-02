const sequelize = require('../config/db');

const Airline = require('./airline');
const Airport = require('./airport');
const Flight = require('./flight');
const User    = require('./user');
const SupportMessage = require('./supportmessage');

// Связи Flight ↔ Airline
Flight.belongsTo(Airline, { foreignKey: 'airlineId' });
Airline.hasMany(Flight, { foreignKey: 'airlineId' });

// Связи Flight ↔ Airport
Flight.belongsTo(Airport, {
  as:        'departureAirport',
  foreignKey:'departureAirportId',
  targetKey: 'id'
});
Flight.belongsTo(Airport, {
  as:        'arrivalAirport',
  foreignKey:'arrivalAirportId',
  targetKey: 'id'
});

// (Опциональные обратные связи)
Airport.hasMany(Flight, {
  as:        'departures',
  foreignKey:'departureAirportId'
});
Airport.hasMany(Flight, {
  as:        'arrivals',
  foreignKey:'arrivalAirportId'
});

// Call the associate method for SupportMessage
SupportMessage.associate({ User });

module.exports = { sequelize, Airline, Airport, Flight, User, SupportMessage };
