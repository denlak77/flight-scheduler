const { Airport, Airline, sequelize } = require('./models');

async function addTestData() {
  try {
    await sequelize.sync();
    // Добавляем аэропорты
    await Airport.bulkCreate([
      { name: 'Шереметьево', code: 'SVO', city: 'Москва', country: 'Россия' },
      { name: 'Пулково', code: 'LED', city: 'Санкт-Петербург', country: 'Россия' },
      { name: 'Домодедово', code: 'DME', city: 'Москва', country: 'Россия' }
    ], { ignoreDuplicates: true });

    // Добавляем авиакомпании
    await Airline.bulkCreate([
      { name: 'Аэрофлот' },
      { name: 'Россия' },
      { name: 'S7 Airlines' }
    ], { ignoreDuplicates: true });

    console.log('Тестовые аэропорты и авиакомпании успешно добавлены!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
    process.exit(1);
  }
}

addTestData(); 