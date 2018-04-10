const express = require('express')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const DarkSky = require('dark-sky')

// import API key for DarkSky
const keys = require('./keys')

// create app
const app = express()

// set express rate limiting and CORS
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
})

app.use(limiter)
app.use(cors())

// DarkSky API
const forecast = new DarkSky(keys.darksky)

app.get('/weather/v1/json', (req, res) => {
  let lat = req.param('lat')
  let lon = req.param('lon')
  let units = req.param('units')

  forecast
    .latitude(lat)
    .longitude(lon)
    .units(units)
    .language('en')
    .exclude('minutely,hourly,flags')
    .get()
    .then(response => {
      res.send(response)
    })
    .catch(error => {
      res.send(error)
    })
})

// Google Maps Geocoding API
var googleMapsClient = require('@google/maps').createClient({
  key: keys.google
})

app.get('/geocode/v1/json', (req, res) => {
  let latlng = req.param('latlng')
  let address = req.param('address')

  if (latlng) {
    googleMapsClient.reverseGeocode({
      latlng: latlng
    }, function (err, response) {
      if (!err) {
        res.send(response.json.results)
      }
    })
  }

  if (address) {
    googleMapsClient.geocode({
      address: address
    }, function (err, response) {
      if (!err) {
        res.send(response.json.results)
      }
    })
  }
})

app.listen(3000, function () {
  console.log('> Starting API server...')
  console.log('> Listening at http://localhost:' + this.address().port)
})
