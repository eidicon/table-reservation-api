const Joi = require('joi')
const reservationsBodySchema = require('../schemas/reservationsBodySchema')
const logger = require('./logger')

const reservationsBodyValidator = async (req, res, next) => {
  logger.info(req.body)
  await Joi.validate(req.body, reservationsBodySchema, (err) => {
    if (err) {
      logger.error(err.message)
      return res.sendStatus(400)
    } else {
      return next()
    }
  })
}

module.exports = reservationsBodyValidator
