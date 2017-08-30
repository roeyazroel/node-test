var singleton = function singleton() {
    const TAG = 'services.routes'
    const config = require('config')
    const express = require('express')
    const app = express()
    const geocodeHelper = require('../helpers/geocode')
    const NearbyHelper = require('../helpers/nearby')
    const HistoryService = require('../services/history')
    const CacheService = require('../services/cache')
    const AuthService = require('../services/auth')

    app.all('*', function(req, res, next) {
        HistoryService.addHistory(req)
        next()
    })

    app.get('/usage', AuthService.auth, function(req, res) {
        res.send(HistoryService.getHistory())
    })

    app.get('/geocode', CacheService.get(), function(req, res) {
        const M_TAG = '/geocode'
        if (req.query.address) {
            geocodeHelper.getLatLong(req.query.address)
                .then(function(result) {
                    res.send(result)
                }).catch(function(err) {
                    console.error(TAG + M_TAG, err)
                    res.status(504).send('Error: ' + err)
                })
        } else {
            res.status(504).send('Error: Missing address parameter in query')
        }
    })

    app.post('/purgeCache', function(req, res) {
        CacheService.purge()
        res.send('OK')
    })

    app.get('/wikiNearby', CacheService.get(), function(req, res) {
        const M_TAG = '/wikiNearby'
        if (req.query.lon && req.query.lat) {
            NearbyHelper.getNearBy(req.query.lat, req.query.lon)
                .then(function(result) {
                    res.send(result)
                }).catch(function(err) {
                    console.error(TAG + M_TAG, err)
                    res.status(504).send('Error: ' + err)
                })
        } else {
            res.status(504).send('Error: Missing lat or long parameter in query')
        }
    })

    this.start = function() {
        app.listen(3000, function() {
            console.log('Example app listening on port 3000!')
        })
    }
}
singleton.instance = null

singleton.getInstance = function() {
    if (this.instance === null) {
        this.instance = new singleton()
    }
    return this.instance
}


module.exports = singleton.getInstance()