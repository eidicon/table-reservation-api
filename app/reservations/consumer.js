const ampq = require('ampqlib')
const logger = require('../utils/logger')
const knex = require('../../db')
const { EXCHANGE_NAME, NOTIFICATIONS_RK } = require('exchangeConfig')
const producer = require('../notifications/producer')

class Consumer {
  static async proceedReservation () {
    const connection = await ampq.connect('amqp://localhost')
    const channel = await connection.createChannel()
    try {
      await channel.checkExchange(EXCHANGE_NAME)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
    try {
      await channel.checkQueue(NOTIFICATIONS_RK)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
    await channel.consume(NOTIFICATIONS_RK, async (msg) => {
      let reservationId
      const startDate = await new Date(msg.reservation.time)
      let endDate = await new Date(startDate.getTime())
      endDate = await new Date(endDate.setMinutes(endDate.getMinutes() + msg.reservation.duration * 60))
      const item = await { guests: msg.reservation.guests, start: startDate, end: endDate, table_id: knex('tables').where('capacity', '>=', msg.reservation.guests).first() }
      try {
        reservationId = await knex('reservations').returning('id').insert(item)
      } catch (err) {
        logger.error(err)
        try {
          await producer.publish({ 'reservationId': null, email: msg.reservation.email })
        } catch (err) {
          logger.error(err)
        }
        return
      }
      try {
        await producer.publish({ 'reservationId': reservationId, email: msg.reservation.email })
      } catch (err) {
        logger.error(err)
      }
    }, { exclusive: true })
  }
}

module.expotrs = Consumer
