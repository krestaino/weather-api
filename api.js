const express = require('express')
const RateLimit = require('express-rate-limit')
const cors = require('cors')
const DarkSky = require('dark-sky')
const NodeGeocoder = require('node-geocoder')

// import API key for DarkSky
const keys = require('./keys')

// set express rate limiting and CORS
const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
})

const app = express()

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
const geocoder = NodeGeocoder(geocoderOptions)

var geocoderOptions = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: keys.google,
  formatter: null
}

app.get('/geocode/v1/json', (req, res) => {
  let latlng = req.param('latlng')
  let address = req.param('address')

  if (latlng) {
    let lat = latlng.split(',')[0]
    let lon = latlng.split(',')[1]

    geocoder.reverse({lat: lat, lon: lon})
      .then(response => {
        res.send(response)
      })
      .catch(error => {
        res.send(error)
      })
  }

  if (address) {
    geocoder.geocode(address)
      .then(response => {
        res.send(response)
      })
      .catch(error => {
        res.send(error)
      })
  }
})

app.listen(3000, function() {
  console.log('Listening on port ' + this.address().port)
})
