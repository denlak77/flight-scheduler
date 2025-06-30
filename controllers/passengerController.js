const { Flight, Airport, Airline } = require('../models');
const { Op } = require('sequelize');
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Панель управления пассажира - теперь просто перенаправляет на расписание рейсов
exports.getDashboard = async (req, res) => {
  try {
    res.redirect('/');
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

// Страница профиля
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);
    res.render('passenger/profile', {
      title: 'Профиль',
      user: user.get({ plain: true })
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке профиля',
      user: req.session.user
    });
  }
};

// Обновление профиля
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findByPk(req.session.user.id);
    let error = null;
    let success = null;

    // Проверка email на уникальность
    if (email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.render('passenger/profile', {
          title: 'Профиль',
          user: user.get({ plain: true }),
          error: 'Пользователь с таким email уже существует.'
        });
      }
    }

    // Обновление имени и email
    user.name = name;
    user.email = email;

    // Если меняется пароль
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        error = 'Пожалуйста, заполните все поля для смены пароля.';
      } else if (!await bcrypt.compare(currentPassword, user.passwordHash)) {
        error = 'Текущий пароль неверен.';
      } else if (newPassword !== confirmPassword) {
        error = 'Новые пароли не совпадают.';
      } else if (newPassword.length < 6) {
        error = 'Новый пароль должен быть не короче 6 символов.';
      } else {
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        success = 'Пароль успешно изменён.';
      }
    }

    if (!error) {
      await user.save();
      req.session.user.name = user.name;
      req.session.user.email = user.email;
      success = success || 'Данные профиля успешно обновлены.';
    }

    res.render('passenger/profile', {
      title: 'Профиль',
      user: user.get({ plain: true }),
      error,
      success
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при обновлении профиля',
      user: req.session.user
    });
  }
};