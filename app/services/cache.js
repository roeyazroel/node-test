var singleton = function singleton() {
    const TAG = 'services.cache'
    const cache = require('memory-cache');

    this.get = function() {
        return function(req, res, next) {
            var key = req.url + '_' + req.query
            var cachedBody = cache.get(key)
            if (cachedBody) {
                console.log(TAG, 'this is from cache')
                res.send(cachedBody)
                return
            } else {
                console.log(TAG, 'this is from server')
                res.sendResponse = res.send
                res.send = (body) => {
                    cache.put(key, body);
                    res.sendResponse(body)
                }
                next()
            }
        }
    }

    this.purge = function() {
        cache.clear()
        console.log(TAG, 'cache purged')
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