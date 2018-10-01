const ampq = require('amqplib')
const logger = require('../utils/logger')
const { EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTIONS, RESERVATIONS_RK } = require('exchangeConfig')

class Producer {
  /**
   * publish message to exchange
   * @param {object} rqBody
   * @return void
   */
  static async publish (rqBody) {
    const connection = await ampq.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTIONS)
    await channel.publish(EXCHANGE_NAME, RESERVATIONS_RK, rqBody)
    logger.info(`[x] Sent ${RESERVATIONS_RK}: ${rqBody}`)
  }
}

module.exports = Producer
