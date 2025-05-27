const { Flight, Airport, Airline } = require('../models');

exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    const airports = await Airport.findAll();
    const airlines = await Airline.findAll();
    res.render('admin/flights', {
      title: 'Управление рейсами',
      user: req.session.user,
      flights,
      airports,
      airlines
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке рейсов',
      user: req.session.user
    });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const { flightNumber, departureAirportId, arrivalAirportId, airlineId, departureTime, arrivalTime, price } = req.body;
    await Flight.create({
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      airlineId,
      departureTime,
      arrivalTime,
      price
    });
    res.redirect('/admin/flights');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при создании рейса',
      user: req.session.user
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { flightNumber, departureAirportId, arrivalAirportId, airlineId, departureTime, arrivalTime, price } = req.body;
    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).render('error', {
        message: 'Рейс не найден',
        user: req.session.user
      });
    }
    await flight.update({
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      airlineId,
      departureTime,
      arrivalTime,
      price
    });
    res.redirect('/admin/flights');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при обновлении рейса',
      user: req.session.user
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).render('error', {
        message: 'Рейс не найден',
        user: req.session.user
      });
    }
    await flight.destroy();
    res.redirect('/admin/flights');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при удалении рейса',
      user: req.session.user
    });
  }
}; 