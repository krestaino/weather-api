const express = require('express')
const googleMaps = require('@google/maps')

const keys = require('../keys.js')

const router = express.Router()
const googleMapsClient = googleMaps.createClient({ key: keys.google })

router.get('/geocode/v1/json', (req, res) => {
  let latlng = req.query.latlng
  let address = req.query.address

  if (latlng) {
    googleMapsClient.reverseGeocode({
      latlng: latlng
    }, (error, response) => {
      if (!error) {
        res.send(response.json.results)
      }
    })
  }

  if (address) {
    googleMapsClient.geocode({
      address: address
    }, (error, response) => {
      if (!error) {
        res.send(response.json.results)
      }
    })
  }
})

module.exports = router
