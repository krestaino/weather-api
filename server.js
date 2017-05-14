const express = require('express')
const RateLimit = require('express-rate-limit');
const cors = require('cors')
const app = express()
const keys = require('./.keys')
const DarkSky = require('dark-sky')
const NodeGeocoder = require('node-geocoder')

const limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 100, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
})

app.use(limiter);
app.use(cors())

// Home
app.get('/', function (req, res) {
  res.send('api.kmr.io')
})

// DarkSky API
const forecast = new DarkSky(keys.darksky)

app.get('/weather/v1/:lat/:lon/:units', function (req, res) {
  let lat = req.params.lat
  let lon = req.params.lon
  let units = req.params.units

  forecast
    .latitude(lat)
    .longitude(lon)
    .units(units)
    .language('en')
    .exclude('minutely,hourly,flags')
    .get()
    .then(function (response) {
      res.send(response)
    })
    .catch(function (error) {
      res.send(error)
    })

  console.log(req.method + ': /weather/v1/'+lat+'/'+lon+'/'+units)
})

// Google Maps Geocoding API
var geocoder = NodeGeocoder(geocoderOptions)
var geocoderOptions = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: keys.google,
  formatter: null
}

app.get('/geocoding/v1/geocode/:query', function (req, res) {
  let query = req.params.query

  geocoder.geocode(query)
    .then(function (response) {
      res.send(response)
    })
    .catch(function (error) {
      res.send(error)
    })

  console.log(req.method + ': /geocoding/v1/geocode/'+query)
})

app.get('/geocoding/v1/reverse/:lat/:lon', function (req, res) {
  let lat = req.params.lat
  let lon = req.params.lon

  geocoder.reverse({lat:lat, lon:lon})
    .then(function (response) {
      res.send(response)
    })
    .catch(function (error) {
      res.send(error)
    })

  console.log(req.method + ': /geocoding/v1/reverse/'+lat+'/'+lon)
})

app.listen(3000)
console.log('API ready.')
