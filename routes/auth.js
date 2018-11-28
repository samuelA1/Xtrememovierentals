const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const router = express.Router();
const User = require('../models/user');
const checkJwt = require('../middleware/check-jwt');

router.post('/register', (req, res, next) => {
    let user = new User();
    user.name = req.body.name;
    user.password = req.body.password;
    user.isSeller = req.body.isSeller;
    user.isAdmin = req.body.isAdmin;
    user.picture = user.gravatar();
    user.email = req.body.email;

    User.findOne({email: req.body.email}, (err, existingUser) => {
        if (err) {return next(err)}

        if(existingUser) {
            res.json({
                success: false,
                message: 'Sorry, a user with this email already exist'
            });
        } else {
            user.save();
            let token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});
            res.json({
                success: true,
                message: 'Registration successful',
                token: token
            });
        }
    })
});

router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found'
            });
        } else if (user) {
            let validatePassword = user.comparePassword(req.body.password);
            if (!validatePassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password'
                });
            } else {
                let token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});
                res.json({
                    success: true,
                    message: 'Login successful',
                    token: token,
            });
            }
        }
    })
});
module.exports = router