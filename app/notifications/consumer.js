const ampq = require('ampqlib')
const logger = require('../utils/logger')
const { EXCHANGE_NAME, NOTIFICATIONS_RK } = require('exchangeConfig')
const transporter = require('../utils/mailer')
const emailComposer = require('../utils/composeEmail')

class Consumer {
  static async proceedNotification () {
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
    try {
      await channel.consume(NOTIFICATIONS_RK, async (msg) => {
        const letter = emailComposer(msg)
        try {
          await transporter.sendMail(letter, (err, info) => {
            if (err) {
              throw err
            } else {
              logger.info(`Email sent: ${info.response}`)
            }
          })
        } catch (err) {
          logger.error(err)
        }
      }, { exclusive: true })
    } catch (err) {
      logger.error(err)
    }
  }
}

module.expotrs = Consumer
