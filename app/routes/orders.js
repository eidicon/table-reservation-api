const express = require('express')
const router = express.Router()
const ordersBodyValidator = require('../utils/ordersBodyValidator')

const ordersCtrl = require('../controllers/orders')

router.use('/orders/:order_id', async (req, res, next) => {
  if (!Number.isInteger(parseInt(req.params.order_id))) {
    return res.sendStatus(400)
  } else {
    return next()
  }
})

router.post('/orders', ordersBodyValidator, ordersCtrl.createOrder)
router.get('/orders/:order_id', ordersCtrl.getOrder)

module.exports = router
