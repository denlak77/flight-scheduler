const express = require('express');
const router = express.Router();
const { checkRole } = require('../middleware/auth');
const adminFlightsController = require('../controllers/adminFlightsController');

// Все маршруты требуют роли администратора
router.use(checkRole(['admin']));

// Список рейсов
router.get('/', adminFlightsController.getFlights);
// Добавить рейс
router.post('/', adminFlightsController.createFlight);
// Редактировать рейс
router.put('/:id', adminFlightsController.updateFlight);
// Удалить рейс
router.delete('/:id', adminFlightsController.deleteFlight);

module.exports = router; 