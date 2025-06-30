const { sequelize, Airline, Airport, Flight } = require('./models');
const { Op } = require('sequelize');

const sampleData = async () => {
    try {
        // Синхронизируем модели (если еще не синхронизированы)
        await sequelize.sync({ alter: true }); // alter: true попытается изменить существующие таблицы, не удаляя их

        console.log('Database synchronized. Adding sample data...');

        // Добавление примеров авиакомпаний (используем findOrCreate, чтобы не дублировать)
        const [aeroflot] = await Airline.findOrCreate({
            where: { code: 'SU' },
            defaults: { name: 'Аэрофлот', country: 'Russia' }
        });
        const [s7] = await Airline.findOrCreate({
            where: { code: 'S7' },
            defaults: { name: 'S7 Airlines', country: 'Russia' }
        });
         const [emirates] = await Airline.findOrCreate({
            where: { code: 'EK' },
            defaults: { name: 'Emirates', country: 'UAE' }
        });
        const [lufthansa] = await Airline.findOrCreate({
            where: { code: 'LH' },
            defaults: { name: 'Lufthansa', country: 'Germany' }
        });
        const [delta] = await Airline.findOrCreate({
            where: { code: 'DL' },
            defaults: { name: 'Delta Air Lines', country: 'USA' }
        });
        const [airFrance] = await Airline.findOrCreate({
            where: { code: 'AF' },
            defaults: { name: 'Air France', country: 'France' }
        });
        const [jal] = await Airline.findOrCreate({
            where: { code: 'JL' },
            defaults: { name: 'Japan Airlines', country: 'Japan' }
        });
         const [qantas] = await Airline.findOrCreate({
            where: { code: 'QF' },
            defaults: { name: 'Qantas', country: 'Australia' }
        });


        // Добавление примеров аэропортов (используем findOrCreate)
        const [svo] = await Airport.findOrCreate({
            where: { code: 'SVO' },
            defaults: { name: 'Sheremetyevo', city: 'Moscow', country: 'Russia' }
        });
        const [dme] = await Airport.findOrCreate({
            where: { code: 'DME' },
            defaults: { name: 'Domodedovo', city: 'Moscow', country: 'Russia' }
        });
        const [vko] = await Airport.findOrCreate({
            where: { code: 'VKO' },
            defaults: { name: 'Vnukovo', city: 'Moscow', country: 'Russia' }
        });
        const [pul] = await Airport.findOrCreate({
            where: { code: 'LED' }, // Using IATA code LED for Pulkovo
            defaults: { name: 'Pulkovo', city: 'Saint Petersburg', country: 'Russia' }
        });
         const [dubai] = await Airport.findOrCreate({
            where: { code: 'DXB' },
            defaults: { name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' }
        });
        const [frankfurt] = await Airport.findOrCreate({
            where: { code: 'FRA' },
            defaults: { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' }
        });
        const [jfk] = await Airport.findOrCreate({
            where: { code: 'JFK' },
            defaults: { name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' }
        });
         const [cdg] = await Airport.findOrCreate({
            where: { code: 'CDG' },
            defaults: { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' }
        });
         const [hnd] = await Airport.findOrCreate({
            where: { code: 'HND' },
            defaults: { name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' }
        });
         const [syd] = await Airport.findOrCreate({
            where: { code: 'SYD' },
            defaults: { name: 'Sydney Airport', city: 'Sydney', country: 'Australia' }
        });


        // Добавление 30 примеров рейсов
        const flights = [
            // Примеры рейсов из Москвы
            { flightNumber: 'SU100', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: pul.id, departureTime: new Date('2025-06-10T08:00:00Z'), arrivalTime: new Date('2025-06-10T09:30:00Z') },
            { flightNumber: 'S7201', airlineId: s7.id, departureAirportId: dme.id, arrivalAirportId: pul.id, departureTime: new Date('2025-06-10T10:00:00Z'), arrivalTime: new Date('2025-06-10T11:40:00Z') },
            { flightNumber: 'SU200', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: pul.id, departureTime: new Date('2025-06-11T12:00:00Z'), arrivalTime: new Date('2025-06-11T13:30:00Z') },
            { flightNumber: 'SU216', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-10T16:00:00Z'), arrivalTime: new Date('2025-06-10T22:30:00Z') },
            { flightNumber: 'LH1445', airlineId: lufthansa.id, departureAirportId: vko.id, arrivalAirportId: frankfurt.id, departureTime: new Date('2025-06-11T09:00:00Z'), arrivalTime: new Date('2025-06-11T12:00:00Z') },
            { flightNumber: 'S7309', airlineId: s7.id, departureAirportId: dme.id, arrivalAirportId: cdg.id, departureTime: new Date('2025-06-12T14:00:00Z'), arrivalTime: new Date('2025-06-12T17:30:00Z') },

            // Примеры рейсов из Санкт-Петербурга
            { flightNumber: 'SU101', airlineId: aeroflot.id, departureAirportId: pul.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-10T10:00:00Z'), arrivalTime: new Date('2025-06-10T11:30:00Z') },
            { flightNumber: 'S7202', airlineId: s7.id, departureAirportId: pul.id, arrivalAirportId: dme.id, departureTime: new Date('2025-06-10T12:00:00Z'), arrivalTime: new Date('2025-06-10T13:40:00Z') },
             { flightNumber: 'EK176', airlineId: emirates.id, departureAirportId: pul.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-11T23:00:00Z'), arrivalTime: new Date('2025-06-12T06:15:00Z') },

            // Примеры международных рейсов
            { flightNumber: 'EK201', airlineId: emirates.id, departureAirportId: dubai.id, arrivalAirportId: jfk.id, departureTime: new Date('2025-06-10T08:00:00Z'), arrivalTime: new Date('2025-06-10T14:40:00Z') },
            { flightNumber: 'LH400', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: jfk.id, departureTime: new Date('2025-06-10T10:00:00Z'), arrivalTime: new Date('2025-06-10T12:55:00Z') },
             { flightNumber: 'DL100', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: cdg.id, departureTime: new Date('2025-06-10T18:00:00Z'), arrivalTime: new Date('2025-06-11T07:00:00Z') },
            { flightNumber: 'AF274', airlineId: airFrance.id, departureAirportId: cdg.id, arrivalAirportId: hnd.id, departureTime: new Date('2025-06-11T13:30:00Z'), arrivalTime: new Date('2025-06-12T08:30:00Z') },
             { flightNumber: 'JL51', airlineId: jal.id, departureAirportId: hnd.id, arrivalAirportId: syd.id, departureTime: new Date('2025-06-12T22:00:00Z'), arrivalTime: new Date('2025-06-13T08:30:00Z') },
            { flightNumber: 'QF1', airlineId: qantas.id, departureAirportId: syd.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-13T16:00:00Z'), arrivalTime: new Date('2025-06-14T00:30:00Z') },
            // Добавьте еще рейсы для получения общего числа около 30
            { flightNumber: 'SU204', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-12T18:00:00Z'), arrivalTime: new Date('2025-06-13T00:30:00Z') },
            { flightNumber: 'LH452', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: cdg.id, departureTime: new Date('2025-06-12T07:00:00Z'), arrivalTime: new Date('2025-06-12T08:15:00Z') },
             { flightNumber: 'DL47', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-11T21:00:00Z'), arrivalTime: new Date('2025-06-12T14:00:00Z') },
            { flightNumber: 'EK202', airlineId: emirates.id, departureAirportId: jfk.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-11T11:00:00Z'), arrivalTime: new Date('2025-06-12T08:40:00Z') },
            { flightNumber: 'SU2345', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: frankfurt.id, departureTime: new Date('2025-06-13T10:00:00Z'), arrivalTime: new Date('2025-06-13T13:00:00Z') },
             { flightNumber: 'S7987', airlineId: s7.id, departureAirportId: dme.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-13T20:00:00Z'), arrivalTime: new Date('2025-06-14T02:30:00Z') },
            { flightNumber: 'LH1024', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-14T14:00:00Z'), arrivalTime: new Date('2025-06-14T19:00:00Z') },
             { flightNumber: 'DL265', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-14T22:00:00Z'), arrivalTime: new Date('2025-06-15T19:40:00Z') },
            { flightNumber: 'EK982', airlineId: emirates.id, departureAirportId: dubai.id, arrivalAirportId: cdg.id, departureTime: new Date('2025-06-15T09:00:00Z'), arrivalTime: new Date('2025-06-15T14:30:00Z') },
             { flightNumber: 'SU2368', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: cdg.id, departureTime: new Date('2025-06-15T16:00:00Z'), arrivalTime: new Date('2025-06-15T20:00:00Z') },
            { flightNumber: 'S7567', airlineId: s7.id, departureAirportId: dme.id, arrivalAirportId: frankfurt.id, departureTime: new Date('2025-06-16T08:00:00Z'), arrivalTime: new Date('2025-06-16T11:00:00Z') },
             { flightNumber: 'LH1025', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: dme.id, departureTime: new Date('2025-06-16T12:00:00Z'), arrivalTime: new Date('2025-06-16T17:00:00Z') },
            { flightNumber: 'DL412', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: frankfurt.id, departureTime: new Date('2025-06-16T19:00:00Z'), arrivalTime: new Date('2025-06-17T08:00:00Z') },
             { flightNumber: 'EK99', airlineId: emirates.id, departureAirportId: dubai.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-17T01:00:00Z'), arrivalTime: new Date('2025-06-17T05:30:00Z') },
            { flightNumber: 'SU705', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: jfk.id, departureTime: new Date('2025-06-17T14:00:00Z'), arrivalTime: new Date('2025-06-17T17:00:00Z') },
             { flightNumber: 'S7965', airlineId: s7.id, departureAirportId: dme.id, arrivalAirportId: hnd.id, departureTime: new Date('2025-06-18T18:00:00Z'), arrivalTime: new Date('2025-06-19T10:00:00Z') },
            { flightNumber: 'LH716', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: hnd.id, departureTime: new Date('2025-06-18T21:00:00Z'), arrivalTime: new Date('2025-06-19T15:30:00Z') },
             { flightNumber: 'DL180', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: hnd.id, departureTime: new Date('2025-06-19T10:00:00Z'), arrivalTime: new Date('2025-06-20T13:40:00Z') },
            { flightNumber: 'EK318', airlineId: emirates.id, departureAirportId: dubai.id, arrivalAirportId: hnd.id, departureTime: new Date('2025-06-19T02:00:00Z'), arrivalTime: new Date('2025-06-19T17:35:00Z') },
             { flightNumber: 'SU260', airlineId: aeroflot.id, departureAirportId: svo.id, arrivalAirportId: syd.id, departureTime: new Date('2025-06-20T05:00:00Z'), arrivalTime: new Date('2025-06-21T03:00:00Z') },
            { flightNumber: 'QF2', airlineId: qantas.id, departureAirportId: dubai.id, arrivalAirportId: syd.id, departureTime: new Date('2025-06-20T09:00:00Z'), arrivalTime: new Date('2025-06-21T06:00:00Z') },
             { flightNumber: 'LH780', airlineId: lufthansa.id, departureAirportId: frankfurt.id, arrivalAirportId: syd.id, departureTime: new Date('2025-06-21T15:00:00Z'), arrivalTime: new Date('2025-06-22T12:00:00Z') },
            { flightNumber: 'DL49', airlineId: delta.id, departureAirportId: jfk.id, arrivalAirportId: syd.id, departureTime: new Date('2025-06-22T08:00:00Z'), arrivalTime: new Date('2025-06-23T17:30:00Z') },
             { flightNumber: 'EK412', airlineId: emirates.id, departureAirportId: syd.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-22T21:00:00Z'), arrivalTime: new Date('2025-06-23T05:30:00Z') },
             { flightNumber: 'SU271', airlineId: aeroflot.id, departureAirportId: syd.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-23T10:00:00Z'), arrivalTime: new Date('2025-06-23T20:00:00Z') },
            { flightNumber: 'S7631', airlineId: s7.id, departureAirportId: hnd.id, arrivalAirportId: dme.id, departureTime: new Date('2025-06-24T11:00:00Z'), arrivalTime: new Date('2025-06-24T18:00:00Z') },
             { flightNumber: 'LH717', airlineId: lufthansa.id, departureAirportId: hnd.id, arrivalAirportId: frankfurt.id, departureTime: new Date('2025-06-24T17:00:00Z'), arrivalTime: new Date('2025-06-24T23:30:00Z') },
            { flightNumber: 'DL181', airlineId: delta.id, departureAirportId: hnd.id, arrivalAirportId: jfk.id, departureTime: new Date('2025-06-25T15:00:00Z'), arrivalTime: new Date('2025-06-25T19:40:00Z') },
             { flightNumber: 'EK319', airlineId: emirates.id, departureAirportId: hnd.id, arrivalAirportId: dubai.id, departureTime: new Date('2025-06-25T19:00:00Z'), arrivalTime: new Date('2026-06-26T01:35:00Z') },
            { flightNumber: 'SU2369', airlineId: aeroflot.id, departureAirportId: cdg.id, arrivalAirportId: svo.id, departureTime: new Date('2025-06-26T09:00:00Z'), arrivalTime: new Date('2025-06-26T13:00:00Z') },
             { flightNumber: 'S7568', airlineId: s7.id, departureAirportId: frankfurt.id, arrivalAirportId: dme.id, departureTime: new Date('2025-06-26T15:00:00Z'), arrivalTime: new Date('2025-06-26T18:00:00Z') },
        ];

        // Вставляем рейсы в базу данных
        await Flight.bulkCreate(flights);

        console.log('Sample flights added successfully.');

    } catch (error) {
        console.error('Error adding sample data:', error);
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
};

sampleData();