const basicAuth = require('basic-auth');
const config = require('config')
const TAG = 'services.auth'

var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === config.auth.user && user.pass === config.auth.password) {
        return next();
    } else {
        return unauthorized(res);
    };
};

module.exports = {
    auth: auth
}