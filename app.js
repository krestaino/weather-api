const express = require('express')
const cors = require('cors')
const RateLimit = require('express-rate-limit')

const geocode = require('./routes/geocode.js')
const weather = require('./routes/weather.js')

const app = express()

// rate limiting
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
})

app.use(cors())
app.use(limiter)
app.use(geocode)
app.use(weather)

app.listen(3000, function () {
  console.log('> Starting API server...')
  console.log('> Listening at http://localhost:' + this.address().port)
})

module.exports = app
