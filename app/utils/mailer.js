const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: process.env.PROVIDER_NAME,
  auth: {
    user: process.env.PROVIDER_LOGIN,
    pass: process.env.PROVIDER_PASSWORD
  }
})

module.exports = transporter
