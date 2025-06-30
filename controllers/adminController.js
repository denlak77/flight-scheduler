const { User, Flight, Airport, Airline } = require('../models');
const bcrypt = require('bcryptjs');

// Панель управления администратора
exports.getDashboard = async (req, res) => {
  try {
    const users = await User.findAll();
    const flights = await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    });
    const airports = await Airport.findAll();
    const airlines = await Airline.findAll();
    res.render('admin/dashboard', {
      title: 'Панель администратора',
      user: req.session.user,
      users: users.map(u => u.get({ plain: true })),
      flights: flights.map(f => f.get({ plain: true })),
      airports: airports.map(a => a.get({ plain: true })),
      airlines: airlines.map(a => a.get({ plain: true }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке панели администратора',
      user: req.session.user
    });
  }
};

// Управление пользователями
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('admin/users', {
      title: 'Управление пользователями',
      user: req.session.user,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при загрузке списка пользователей',
      user: req.session.user
    });
  }
};

exports.getCreateUserPage = (req, res) => {
  res.render('admin/users/new', {
    title: 'Добавление нового пользователя',
    user: req.session.user
  });
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('admin/users', {
        title: 'Управление пользователями',
        user: req.session.user,
        error: 'Пользователь с таким email уже существует'
      });
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    await User.create({
      name,
      email,
      passwordHash,
      role
    });

    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при создании пользователя',
      user: req.session.user
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).render('error', {
        message: 'Пользователь не найден',
        user: req.session.user
      });
    }

    await user.update({ name, email, role });
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при обновлении пользователя',
      user: req.session.user
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).render('error', {
        message: 'Пользователь не найден',
        user: req.session.user
      });
    }

    await user.destroy();
    res.redirect('/admin/users');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при удалении пользователя',
      user: req.session.user
    });
  }
};

// Обработка добавления нового аэропорта
exports.addAirport = async (req, res) => {
  try {
    const { name, city, code, country } = req.body;
    await Airport.create({ name, city, code, country });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Ошибка при добавлении аэропорта:', error);
    res.status(500).render('error', {
      message: 'Ошибка при добавлении аэропорта: ' + (error.message || error),
      user: req.session.user
    });
  }
};

// Обновление аэропорта
exports.updateAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, code } = req.body;
    const airport = await Airport.findByPk(id);
    if (!airport) {
      return res.status(404).render('error', {
        message: 'Аэропорт не найден',
        user: req.session.user
      });
    }
    await airport.update({ name, city, code });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при обновлении аэропорта',
      user: req.session.user
    });
  }
};

// Удаление аэропорта
exports.deleteAirport = async (req, res) => {
  try {
    const { id } = req.params;
    const airport = await Airport.findByPk(id);
    if (!airport) {
      return res.status(404).render('error', {
        message: 'Аэропорт не найден',
        user: req.session.user
      });
    }
    await airport.destroy();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      message: 'Ошибка при удалении аэропорта',
      user: req.session.user
    });
  }
};

// Добавление авиакомпании
exports.addAirline = async (req, res) => {
  try {
    const { name, code, country } = req.body;
    await Airline.create({ name, code, country });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Ошибка при добавлении авиакомпании:', error);
    res.status(500).render('error', {
      message: 'Ошибка при добавлении авиакомпании: ' + (error.message || error),
      user: req.session.user
    });
  }
};

// Обновление авиакомпании
exports.updateAirline = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, country } = req.body;
    const airline = await Airline.findByPk(id);
    if (!airline) {
      return res.status(404).render('error', {
        message: 'Авиакомпания не найдена',
        user: req.session.user
      });
    }
    await airline.update({ name, code, country });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Ошибка при обновлении авиакомпании:', error);
    res.status(500).render('error', {
      message: 'Ошибка при обновлении авиакомпании: ' + (error.message || error),
      user: req.session.user
    });
  }
};

// Удаление авиакомпании
exports.deleteAirline = async (req, res) => {
  try {
    const { id } = req.params;
    const airline = await Airline.findByPk(id);
    if (!airline) {
      return res.status(404).render('error', {
        message: 'Авиакомпания не найдена',
        user: req.session.user
      });
    }
    await airline.destroy();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Ошибка при удалении авиакомпании:', error);
    res.status(500).render('error', {
      message: 'Ошибка при удалении авиакомпании: ' + (error.message || error),
      user: req.session.user
    });
  }
}; 