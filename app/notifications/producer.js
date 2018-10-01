const ampq = require('amqplib')
const logger = require('../utils/logger')
const { EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTIONS, NOTIFICATIONS_RK } = require('exchangeConfig')

class Producer {
  /**
   * publish message to exchange
   * @param {object} rqBody
   * @return void
   */
  static async publish (letter) {
    const connection = await ampq.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, EXCHANGE_OPTIONS)
    await channel.publish(EXCHANGE_NAME, NOTIFICATIONS_RK, letter)
    logger.info(`[x] Sent ${NOTIFICATIONS_RK}: ${letter}`)
  }
}

module.exports = Producer
