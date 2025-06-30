const { Flight, Airport, Airline, User } = require('../models');

// Панель управления оператора
exports.getDashboard = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    
    res.render('operator/dashboard', {
      title: 'Панель оператора',
      user: req.session.user,
      flights
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке панели управления',
      user: req.session.user
    });
  }
};

// Управление рейсами
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

    res.render('operator/flights', {
      title: 'Управление рейсами',
      user: req.session.user,
      flights,
      airports,
      airlines
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке списка рейсов',
      user: req.session.user
    });
  }
};

exports.createFlight = async (req, res) => {
  try {
    const { flightNumber, departureAirportId, arrivalAirportId, airlineId, departureTime, arrivalTime } = req.body;

    await Flight.create({
      flightNumber,
      departureAirportId,
      arrivalAirportId,
      airlineId,
      departureTime,
      arrivalTime
    });

    res.redirect('/operator/flights');
  } catch (error) {
    console.error(error);
    res.render('operator/flights', {
      title: 'Управление рейсами',
      user: req.session.user,
      error: 'Ошибка при создании рейса'
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { flightNumber, departureAirportId, arrivalAirportId, airlineId, departureTime, arrivalTime } = req.body;

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
      arrivalTime
    });

    res.redirect('/operator/flights');
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
    res.redirect('/operator/flights');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при удалении рейса',
      user: req.session.user
    });
  }
};

// Страница поддержки
exports.getSupport = async (req, res) => {
  try {
    res.render('operator/support', {
      title: 'Сообщения поддержки',
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке страницы поддержки',
      user: req.session.user
    });
  }
};

// Добавляю функцию для отображения страницы редактирования рейса
exports.renderEditFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findByPk(id);
    if (!flight) {
      return res.status(404).render('error', {
        message: 'Рейс не найден',
        user: req.session.user
      });
    }
    const airports = await Airport.findAll();
    const airlines = await Airline.findAll();
    res.render('operator/flights/edit', {
      title: 'Редактирование рейса',
      user: req.session.user,
      flight: flight.get({ plain: true }),
      airports: airports.map(a => a.get({ plain: true })),
      airlines: airlines.map(a => a.get({ plain: true }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке страницы редактирования',
      user: req.session.user
    });
  }
};

// Форма создания нового рейса
exports.renderNewFlight = async (req, res) => {
  try {
    const airports = await Airport.findAll();
    const airlines = await Airline.findAll();
    res.render('operator/flights/new', {
      title: 'Добавление нового рейса',
      user: req.session.user,
      airports: airports.map(a => a.get({ plain: true })),
      airlines: airlines.map(a => a.get({ plain: true }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке страницы создания рейса',
      user: req.session.user
    });
  }
}; 