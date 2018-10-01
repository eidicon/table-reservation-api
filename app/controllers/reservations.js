const knex = require('../../db')
const axios = require('axios')
const logger = require('../utils/logger')
const producer = require('../notifications/producer')

class Reservations {
  static async createReservation (req, res) {
    try {
      producer.publish(req.body)
    } catch (err) {
      logger.error(err)
      return res.status(500).send(`Reservation service temporarry unavailable`)
    }
    res.status(200).send(`OK`)

    let reservationId
    const startDate = new Date(req.body.reservation.time)
    let endDate = new Date(startDate.getTime())
    endDate = new Date(endDate.setMinutes(endDate.getMinutes() + req.body.reservation.duration * 60))

    const item = { guests: req.body.reservation.guests, start: startDate, end: endDate, table_id: knex('tables').where('capacity', '>=', req.body.reservation.guests).first() }
    try {
      reservationId = await knex('reservations').returning('id').insert(item)
    } catch (err) {
      logger.error(err)
      return res.sendStatus(404)
    }
    res.status(201).header('Location', `/api/reservations/${reservationId}`).send()
  }

  static async getReservationInfo (req, res) {
    let reservation
    try {
      reservation = await knex('reservations')
        .where({ id: req.params.reservation_id })
        .first()
    } catch (err) {
      logger.error(err)
      return res.sendStatus(404)
    }
    if (reservation.length <= 0) {
      return res.sendStatus(404)
    }
    return res.status(200).json({ 'reservation': reservation })
  }

  static async updateReservation (req, res) {
    let reservationId
    const startDate = new Date(req.body.reservation.time)
    let endDate = new Date(startDate.getTime())
    endDate = new Date(endDate.setMinutes(endDate.getMinutes() + req.body.reservation.duration * 60))
    try {
      reservationId = await knex('reservations')
        .returning('id')
        .where('end', '<', startDate)
        .orWhere('start', '>', endDate)
        .andWhere({ id: req.params.reservation_id })
        .update({
          start: startDate,
          end: endDate,
          guests: req.body.reservation.guests,
          table_id: knex('tables').where('capacity', '>=', req.body.reservation.guests).first()
        })
    } catch (err) {
      logger.error(err)
      return res.sendStatus(409)
    }
    res.status(201).header('Location', `/api/reservations/${reservationId}`).send()
  }

  static async addOrderToReservation (req, res) {
    const body = req.body
    const response = await axios.post('/api/orders', { body })
    const status = await response.status
    if (status !== 201) {
      return res.sendStatus(404)
    }
    const headers = await response.headers()
    const header = await headers[Object.getOwnPropertySymbols(headers)[0]]
    const link = await header['Location']
    if (link.length <= 0) {
      return res.sendStatus(404)
    }
    try {
      await knex('reservations').where({ id: req.params.reservation_id }).upadte({ orderUri: link })
    } catch (err) {
      logger.error(err)
      return res.sendStatus(404)
    }
    res.sendStatus(201)
  }

  static async deleteReservation (req, res) {
    try {
      await knex('reservations')
        .where({ id: req.params.reservation_id })
        .del()
    } catch (err) {
      logger.error(err)
      return res.sendStatus(400)
    }
    return res.sendStatus(204)
  }
}

module.exports = Reservations
