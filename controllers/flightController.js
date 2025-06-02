// Бизнес-логика для рейсов
const Flight = require('../models/flight');
const Airport = require('../models/airport');
const Airline = require('../models/airline');

exports.getAllFlights = async (req, res) => {
  try {
    const flights = (await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    })).map(f => f.get({ plain: true }));
    res.render('flights/index', { flights, isAdmin: req.user.role === 'admin' });
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
    res.render('flights/details', { flight: flight.get({ plain: true }) });
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

exports.searchFlights = async (req, res) => {
  try {
    const { departureAirport, arrivalAirport, departureDate, roundTrip } = req.query;

    // Basic validation (can be enhanced)
    if (!departureAirport || !arrivalAirport || !departureDate) {
      // If required parameters are missing, redirect to the main flights page or show an error
      const flights = (await Flight.findAll({
        include: [
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' },
          { model: Airline }
        ]
      })).map(f => f.get({ plain: true }));
       return res.render('flights/index', { 
         flights, 
         searchParams: req.query, 
         isAdmin: req.user?.role === 'admin',
         searched: false
       });
    }

    // Convert date to start and end of the day for searching
    const startDate = new Date(departureDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(departureDate);
    endDate.setHours(23, 59, 59, 999);

    // Find departure and arrival airport IDs based on name/code input
    const depAirport = await Airport.findOne({ where: { [require('sequelize').Op.or]: [{ name: departureAirport }, { city: departureAirport }] } });
    const arrAirport = await Airport.findOne({ where: { [require('sequelize').Op.or]: [{ name: arrivalAirport }, { city: arrivalAirport }] } });

    let flights = [];

    if (depAirport && arrAirport) {
       flights = (await Flight.findAll({
        where: {
          departureAirportId: depAirport.id,
          arrivalAirportId: arrAirport.id,
          departureTime: {
            [require('sequelize').Op.between]: [startDate, endDate]
          }
        },
        include: [
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' },
          { model: Airline }
        ]
      })).map(f => f.get({ plain: true }));
    }

    res.render('flights/index', { 
        flights, 
        searchParams: req.query,
        isAdmin: req.user?.role === 'admin',
        searched: true
    });

  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).render('error', { error: 'Failed to search flights' });
  }
};

// Дополните остальными методами...
