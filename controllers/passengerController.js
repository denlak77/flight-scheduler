const { Flight, Airport, Airline } = require('../models');
const { Op } = require('sequelize');

// Панель управления пассажира - теперь просто перенаправляет на расписание рейсов
exports.getDashboard = async (req, res) => {
  try {
    res.redirect('/flights');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке панели управления',
      user: req.session.user
    });
  }
};

// Просмотр доступных рейсов - этот функционал остается
exports.getAvailableFlights = async (req, res) => {
  try {
    console.log('Inside getAvailableFlights');
    console.log('Flight model:', Flight);
    console.log('Airport model:', Airport);
    console.log('Airline model:', Airline);
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    
    res.render('flights/index', { 
      flights: flights.map(f => f.get({ plain: true })),
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке списка рейсов',
      user: req.session.user
    });
  }
};

// Функции бронирования и отмены билетов удалены, так как функционал билетов убран.
// exports.bookTicket = async (req, res) => { ... }
// exports.cancelTicket = async (req, res) => { ... }

// Страница поддержки - этот функционал остается
exports.getSupport = async (req, res) => {
  try {
    res.render('passenger/support', {
      title: 'Поддержка',
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