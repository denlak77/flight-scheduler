const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/', flightController.getAllFlights);
router.post('/create', flightController.createFlight);

// Дополните другими маршрутами...

module.exports = router;
