const express = require('express')
const router = express.Router()
const reservationsBodyValidator = require('../utils/reservationsBodyValidator')

const reservationsCtrl = require('../controllers/reservations')

router.use('/reservations/:reservation_id', async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.reservation_id))) {
    return res.sendStatus(400)
  } else {
    return next()
  }
})
router.post('/reservations/:reservation_id/orders', reservationsCtrl.addOrderToReservation)

router.post('/reservations', reservationsBodyValidator, reservationsCtrl.createReservation)

router.put('/reservations/:reservation_id', reservationsBodyValidator, reservationsCtrl.updateReservation)

router.route('/reservations/:reservation_id')
  .get(reservationsCtrl.getReservationInfo)
  .delete(reservationsCtrl.deleteReservation)

module.exports = router
