const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
    let token = req.headers["authorization"];
    if (!token) {
        res.status(403).json({
            success: false,
            message: 'No token provided'
        })
    } else {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to verify token'
                });
            } else {
                req.decoded = decoded
                next();
            }
        });
    }
}