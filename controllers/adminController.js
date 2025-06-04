const { User, Flight, Airport, Airline } = require('../models');
const bcrypt = require('bcryptjs');

// Панель управления администратора
exports.getDashboard = async (req, res) => {
  try {
    const users = (await User.findAll()).map(u => u.get({ plain: true }));
    const flights = (await Flight.findAll({
      include: [
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
        { model: Airline }
      ]
    })).map(f => f.get({ plain: true }));
    
    res.render('admin/dashboard', {
      title: 'Панель администратора',
      user: req.session.user,
      users,
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