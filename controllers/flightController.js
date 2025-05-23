// Бизнес-логика для рейсов
const Flight = require('../models/flight');

exports.getAllFlights = async (req, res) => {
  const flights = await Flight.findAll();
  res.render('flights/index', { flights });
};

exports.createFlight = async (req, res) => {
  await Flight.create(req.body);
  res.redirect('/flights');
};

// Дополните остальными методами...
