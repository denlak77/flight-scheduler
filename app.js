const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');

// Подключаем Sequelize и инициализируем все модели
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка Handlebars
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {
    formatDate: function(date) {
      if (!date) return '';
      return new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    eq: function(v1, v2) {
      return v1 === v2;
    },
    formatDateTimeLocal: function(date) {
      if (!date) return '';
      const d = new Date(date);
      const pad = n => n.toString().padStart(2, '0');
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    },
    json: function(context) {
      return JSON.stringify(context, null, 2);
    }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(methodOverride('_method'));

// Routes
const flightRoutes = require('./routes/flights');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const operatorRoutes = require('./routes/operator');
const passengerRoutes = require('./routes/passenger');
const adminFlightsRoutes = require('./routes/adminFlights');
app.use('/flights', flightRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/operator', operatorRoutes);
app.use('/passenger', passengerRoutes);
app.use('/admin/flights', adminFlightsRoutes);

// API маршруты для поддержки
const supportRoutes = require('./routes/support');
app.use('/api/support', supportRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Система бронирования авиабилетов',
    user: req.session.user
  });
});

// Синхронизируем модели с БД и запускаем сервер
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to synchronize database:', err);
  });
