const sequelize = require('../config/db');
const Airline = require('./airline');
const Airport = require('./airport');
const Flight = require('./flight');
const User    = require('./user');
const Ticket  = require('./ticket');

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

// Связи Ticket ↔ User и Flight
Ticket.belongsTo(User,   { foreignKey: 'userId'   });
User.hasMany(Ticket,     { foreignKey: 'userId'   });
Ticket.belongsTo(Flight, { foreignKey: 'flightId' });
Flight.hasMany(Ticket,   { foreignKey: 'flightId' });

module.exports = { sequelize, Airline, Airport, Flight, User, Ticket };
