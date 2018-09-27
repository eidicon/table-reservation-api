const Joi = require('joi')
const bodySchema = require('../schemas/bodySchema')
const logger = require('./logger')

const validator = async (req, res, next) => {
  logger.info(req.body)
  await Joi.validate(req.body, bodySchema, (err) => {
    if (err) {
      logger.error(err.message)
      return res.sendStatus(400)
    } else {
      return next()
    }
  })
}

module.exports = validator
