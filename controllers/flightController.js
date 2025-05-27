// Бизнес-логика для рейсов
const Flight = require('../models/flight');
const Airport = require('../models/Airport');
const Airline = require('../models/Airline');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    res.render('flights/index', { flights });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch flights' });
  }
};

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    if (!flight) {
      return res.status(404).render('error', { error: 'Flight not found' });
    }
    res.render('flights/details', { flight });
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to fetch flight details' });
  }
};

exports.createFlight = async (req, res) => {
  try {
    await Flight.create(req.body);
    res.redirect('/flights');
  } catch (error) {
    res.status(400).render('flights/create', { 
      error: 'Failed to create flight',
      formData: req.body
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).render('error', { error: 'Flight not found' });
    }
    await flight.update(req.body);
    res.redirect('/flights');
  } catch (error) {
    res.status(400).render('flights/edit', {
      error: 'Failed to update flight',
      flight: req.body
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).render('error', { error: 'Flight not found' });
    }
    await flight.destroy();
    res.redirect('/flights');
  } catch (error) {
    res.status(500).render('error', { error: 'Failed to delete flight' });
  }
};

// Дополните остальными методами...
