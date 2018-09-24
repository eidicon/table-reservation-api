const knex = require('../../db')
class Reservations {
  static async createReservation (req, res) {
    let reservationId
    const startDate = new Date(req.body.reservation.time)
    let endDate = new Date(startDate.getTime())
    endDate = new Date(endDate.setMinutes(endDate.getMinutes() + req.body.reservation.duration * 60))

    const item = { guests: req.body.reservation.guests, start: startDate, end: endDate, table_id: knex('tables').where('capasity', '>=', req.body.reservation.guests).first() }
    try {
      reservationId = await knex('reservations').returning('id').insert(item)
    } catch (err) {
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
          table_id: knex('tables').where('capasity', '>=', req.body.reservation.guests).first()
        })
    } catch (err) {
      return res.sendStatus(409)
    }
    res.status(201).header('Location', `/api/reservations/${reservationId}`).send()
  }

  static async deleteReservation (req, res) {
    try {
      await knex('reservations')
        .where({ id: req.params.reservation_id })
        .del()
    } catch (err) {
      return res.sendStatus(400)
    }
    return res.sendStatus(204)
  }
}

module.exports = Reservations
