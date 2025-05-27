const express = require('express');
const router = express.Router();
const { SupportMessage } = require('../models');
const { checkRole } = require('../middleware/auth');

// Получить все сообщения (только для операторов)
router.get('/messages', checkRole(['operator']), async (req, res) => {
  try {
    const messages = await SupportMessage.findAll({
      include: ['User'],
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении сообщений' });
  }
});

// Получить сообщения текущего пользователя
router.get('/messages/my', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }

    const messages = await SupportMessage.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'ASC']] // Изменено с DESC на ASC
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении сообщений' });
  }
});

// Отправить новое сообщение
router.post('/messages', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ error: 'Пользователь не авторизован или сессия недействительна' });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    const supportMessage = await SupportMessage.create({
      userId: req.session.user.id,
      message,
      status: 'open'
    });

    res.status(201).json(supportMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при отправке сообщения' });
  }
});

// Ответить на сообщение (только для операторов)
router.post('/messages/:id/reply', checkRole(['operator']), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await SupportMessage.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Сообщение не найдено' });
    }

    await message.update({
      reply,
      status: 'closed'
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при отправке ответа' });
  }
});

// Удалить историю чата пользователя (только для операторов)
router.delete('/messages/user/:userId', checkRole(['operator']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Проверяем существование пользователя (опционально)
    // const user = await User.findByPk(userId);
    // if (!user) {
    //   return res.status(404).json({ error: 'Пользователь не найден' });
    // }
    
    // Удаляем все сообщения пользователя
    await SupportMessage.destroy({
      where: { userId: userId }
    });
    
    res.json({ success: true, message: 'История чата успешно удалена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при удалении истории чата' });
  }
});

module.exports = router;