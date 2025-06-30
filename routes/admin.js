const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { checkRole } = require('../middleware/auth');

// Все маршруты требуют роли администратора
router.use(checkRole(['admin']));

// Панель управления
router.get('/dashboard', adminController.getDashboard);
router.post('/dashboard/airports', adminController.addAirport);
router.put('/dashboard/airports/:id', adminController.updateAirport);
router.delete('/dashboard/airports/:id', adminController.deleteAirport);
router.post('/dashboard/airlines', adminController.addAirline);
router.put('/dashboard/airlines/:id', adminController.updateAirline);
router.delete('/dashboard/airlines/:id', adminController.deleteAirline);

// Управление пользователями
router.get('/users', adminController.getUsers);
router.get('/users/new', adminController.getCreateUserPage);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router; 