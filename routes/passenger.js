const express = require('express');
const router = express.Router();
const passengerController = require('../controllers/passengerController');
const { checkRole } = require('../middleware/auth');

// Все маршруты требуют роли пассажира
router.use(checkRole(['passenger']));

// Панель управления (перенаправляет на расписание)
router.get('/dashboard', passengerController.getDashboard);

// Просмотр доступных рейсов
router.get('/flights', passengerController.getAvailableFlights);

// Удалены маршруты для бронирования и отмены билетов
// router.post('/flights/:flightId/book', passengerController.bookTicket);
// router.delete('/tickets/:ticketId', passengerController.cancelTicket);

// Страница поддержки
router.get('/support', passengerController.getSupport);

module.exports = router;