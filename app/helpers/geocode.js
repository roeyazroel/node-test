var singleton = function singleton() {
    const TAG = 'helpers.geocoder'
    const config = require('config')
    const NodeGeocoder = require('node-geocoder')
    const Q = require('q')
    const options = {
        provider: config.geocode.provider,
        httpAdapter: config.geocode.httpAdapter
    }

    const geocoder = NodeGeocoder(options)

    this.getLatLong = function(address) {
        const M_TAG = '.getLatLong'
        var deferred = Q.defer()
        geocoder.geocode(address)
            .then(function(res) {
                res = res[0]
                if (res.latitude || res.longitude)
                    deferred.resolve({
                        lat: res.latitude,
                        lon: res.longitude
                    })
                else
                    deferred.reject('missing latitude or longitude in response')
            })
            .catch(function(err) {
                console.error(TAG + M_TAG, err, address)
                deferred.reject(err)
            })
        return deferred.promise
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