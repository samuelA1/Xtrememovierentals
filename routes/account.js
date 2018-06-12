const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/check-jwt');
const User = require('../models/user');

router.post('/address', checkJwt, (req, res, next) => {
        User.findById({_id: req.decoded.user._id}, (err, user) => {
            if(err) return next(err);

            if(req.body.addr1) user.address.addr1 = req.body.addr1;
            if(req.body.addr2) user.address.addr2 = req.body.addr2;
            if(req.body.city) user.address.city = req.body.city;
            if(req.body.country) user.address.country = req.body.country;
            if(req.body.state) user.address.state = req.body.state;
            if(req.body.zip) user.address.zip = req.body.zip;

            user.save();
            res.json({
                success: true,
                message: 'Address successfully updated'
            });
        });
    });

module.exports = router;