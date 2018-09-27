const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const reservationsRoutes = require('./app/routes/reservations')
const ordersRoutes = require('./app/routes/orders')

let port = process.env.NODE_PORT || 8080

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', (req, res, next) => res.send('pong'))
app.use('/api', reservationsRoutes)
app.use('/api', ordersRoutes)

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
