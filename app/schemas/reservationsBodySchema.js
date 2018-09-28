const Joi = require('joi')

const reservationsBodySchema = Joi.object().keys({
  reservation: Joi.object().keys({
    guests: Joi.number().integer().positive().min(1).max(10).required(),
    time: Joi.date().iso().greater('now'),
    duration: Joi.number().precision(1).positive().min(0.5).max(6).required()
  }).required()
})

module.exports = reservationsBodySchema
