const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { checkAuth } = require('../middleware/auth');

// Применяем middleware checkAuth ко всем маршрутам в этом роутере
router.use(checkAuth);

// Get all flights
router.get('/', flightController.getAllFlights);

// Get flight details
router.get('/:id', flightController.getFlightById);

// Create new flight
router.get('/create', (req, res) => {
  res.render('flights/create');
});
router.post('/create', flightController.createFlight);

// Edit flight
router.get('/:id/edit', async (req, res) => {
  const flight = await Flight.findByPk(req.params.id);
  res.render('flights/edit', { flight });
});
router.post('/:id/edit', flightController.updateFlight);

// Delete flight
router.post('/:id/delete', flightController.deleteFlight);

module.exports = router;
