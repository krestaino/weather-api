const express = require('express')
const DarkSky = require('dark-sky')

const keys = require('../keys.js')

const router = express.Router()
const forecast = new DarkSky(keys.darksky)

router.get('/weather/v1/json', (req, res) => {
  let lat = req.query.lat
  let lon = req.query.lon
  let units = req.query.units

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

module.exports = router
