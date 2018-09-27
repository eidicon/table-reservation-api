const express = require('express')
const router = express.Router()
const bodyValidator = require('../utils/bodyVaidator')

const reservationsCtrl = require('../controllers/reservations')

router.use('/reservations/:reservation_id', async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.reservation_id))) {
    return res.sendStatus(400)
  } else {
    return next()
  }
})

router.post('/reservations', bodyValidator, reservationsCtrl.createReservation)

router.put('/reservations/:reservation_id', bodyValidator, reservationsCtrl.updateReservation)

router.route('/reservations/:reservation_id')
  .get(reservationsCtrl.getReservationInfo)
  .delete(reservationsCtrl.deleteReservation)

module.exports = router
