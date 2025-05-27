const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const { checkRole } = require('../middleware/auth');

// Все маршруты требуют роли оператора
router.use(checkRole(['operator']));

// Панель управления
router.get('/dashboard', operatorController.getDashboard);

// Страница поддержки
router.get('/support', operatorController.getSupport);

// Управление рейсами
router.get('/flights', operatorController.getFlights);
router.post('/flights', operatorController.createFlight);
router.put('/flights/:id', operatorController.updateFlight);
router.delete('/flights/:id', operatorController.deleteFlight);

// Управление билетами
router.get('/tickets', operatorController.getTickets);
router.delete('/tickets/:id', operatorController.cancelTicket);

module.exports = router; 