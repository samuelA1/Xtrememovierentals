module.exports = function(req, res, next) {
    if(req.decoded.user.isAdmin) {
        return next()
    } else {
        res.json({
            success: false,
            message: 'Sorry, you must be an administrator'
        });
    }
}