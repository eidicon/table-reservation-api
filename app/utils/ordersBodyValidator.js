const Joi = require('joi')
const ordersBodySchema = require('../schemas/ordersBodySchema')
const logger = require('./logger')

const ordersBodyValidator = async (req, res, next) => {
  logger.info(req.body)
  await Joi.validate(req.body, ordersBodySchema, (err) => {
    if (err) {
      logger.error(err.message)
      return res.sendStatus(400)
    } else {
      return next()
    }
  })
}

module.exports = ordersBodyValidator
