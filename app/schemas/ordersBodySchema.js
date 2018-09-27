const Joi = require('joi')

const ordersBodySchema = Joi.object().keys({
  meals: Joi.array().items(Joi.string().required()).min(1).required()
})

module.exports = ordersBodySchema
