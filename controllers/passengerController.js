const { Flight, Airport, Airline, Ticket } = require('../models');

// Панель управления пассажира
exports.getDashboard = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.session.user.id },
      include: [
        { model: Flight, include: [
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' }
        ] }
      ]
    });

    res.render('passenger/dashboard', {
      title: 'Мои билеты',
      user: req.session.user,
      tickets: tickets.map(t => t.get({ plain: true }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке панели управления',
      user: req.session.user
    });
  }
};

// Просмотр доступных рейсов
exports.getAvailableFlights = async (req, res) => {
  console.log('DEBUG: Entering getAvailableFlights');
  try {
    const flights = (await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    })).map(f => f.get({ plain: true }));

    res.render('passenger/flights', {
      title: 'Доступные рейсы',
      user: req.session.user,
      flights
    });
    console.log('DEBUG: Exiting getAvailableFlights successfully');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке списка рейсов',
      user: req.session.user
    });
  }
};

// Бронирование билета
exports.bookTicket = async (req, res) => {
  try {
    const { flightId } = req.params;
    const flight = await Flight.findByPk(flightId);
    if (!flight) {
      return res.status(404).render('error', {
        message: 'Рейс не найден',
        user: req.session.user
      });
    }
    await Ticket.create({
      userId: req.session.user.id,
      flightId,
      status: 'booked'
    });
    res.redirect('/passenger/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при бронировании билета',
      user: req.session.user
    });
  }
};

// Отмена бронирования
exports.cancelTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({
      where: {
        id: ticketId,
        userId: req.session.user.id
      }
    });
    if (!ticket) {
      return res.status(404).render('error', {
        message: 'Билет не найден',
        user: req.session.user
      });
    }
    await ticket.destroy();
    res.redirect('/passenger/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при отмене бронирования',
      user: req.session.user
    });
  }
}; 