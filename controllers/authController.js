const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Вход в систему',
    user: req.session.user
  });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', {
        title: 'Вход в систему',
        error: 'Неверный email или пароль',
        user: req.session.user
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.render('auth/login', {
        title: 'Вход в систему',
        error: 'Неверный email или пароль',
        user: req.session.user
      });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Перенаправление в зависимости от роли
    switch (user.role) {
      case 'admin':
        res.redirect('/admin/dashboard');
        break;
      case 'operator':
        res.redirect('/operator/dashboard');
        break;
      case 'passenger':
        res.redirect('/passenger/dashboard');
        break;
      default:
        res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.render('auth/login', {
      title: 'Вход в систему',
      error: 'Произошла ошибка при входе',
      user: req.session.user
    });
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Регистрация',
    user: req.session.user
  });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Регистрация',
        error: 'Пользователь с таким email уже существует',
        user: req.session.user
      });
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем нового пользователя (по умолчанию роль 'passenger')
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'passenger'
    });

    // Автоматически входим в систему
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/passenger/dashboard');
  } catch (error) {
    console.error(error);
    res.render('auth/register', {
      title: 'Регистрация',
      error: 'Произошла ошибка при регистрации',
      user: req.session.user
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
}; 