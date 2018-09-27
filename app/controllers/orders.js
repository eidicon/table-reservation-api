const knex = require('../../db')
const logger = require('../utils/logger')

class Orders {
  static async createOrder (req, res) {
    let orderId
    const item = { meals: req.body.reservation.meals }
    try {
      orderId = await knex('orders').returning('id').insert(item)
    } catch (err) {
      logger.error(err)
      return res.sendStatus(404)
    }
    res.status(201).header('Location', `/api/orders/${orderId}`).send()
  }

  static async getOrder (req, res) {
    let order
    try {
      order = await knex('orders')
        .where({ reservation_id: req.params.reservation_id })
        .select()
    } catch (err) {
      logger.error(err)
      return res.sendStatus(404)
    }
    if (order.length > 0) {
      return res.sendStatus(404)
    }
    return res.status(200).json({ 'order': order })
  }
}

module.exports = Orders
