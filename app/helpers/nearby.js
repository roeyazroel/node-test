const request = require('request')
const config = require('config')
const Q = require('q')
const TAG = 'helpers.nearby'

function getNearBy(lat, long) {
    const M_TAG = '.getNearBy'
    var deferred = Q.defer()
    var req = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=coordinates%7Cpageimages&generator=geosearch&' +
        'colimit=' + config.WikiMedia.colimit +
        '&piprop=thumbnail&pithumbsize=' + config.WikiMedia.pithumbsize +
        '&pilimit=' + config.WikiMedia.pilimit +
        '&ggscoord=' + lat + '%7C-' + long +
        '&ggsradius=' + config.WikiMedia.ggsradius +
        '&ggslimit=' + config.WikiMedia.ggslimit
    request(req, function(error, response, body) {
        if (error) {
            console.error(TAG + M_TAG, 'error:', error)
            deferred.reject(error)
        } else if (response.statusCode != 200) {
            console.warn(TAG + M_TAG, 'response:', response)
            deferred.reject(response)
        } else {
            var result = []
            try {
                body = JSON.parse(body)
                var pages = body.query.pages
                for (var page in pages) {
                    var p = pages[page]
                    if (p.title && p.thumbnail && p.coordinates[0].lat && p.coordinates[0].lon) {
                        result.push({
                            title: p.title,
                            thumbnail: p.thumbnail.source,
                            coordinates: {
                                lat: p.coordinates[0].lat,
                                lon: p.coordinates[0].lon
                            }
                        })
                    }
                }
            } catch (error) {
                console.error(TAG + M_TAG, 'error:', error)
                deferred.reject(error)
            }
            deferred.resolve(result)
        }
    })
    return deferred.promise
}

module.exports = {
    getNearBy: getNearBy
}