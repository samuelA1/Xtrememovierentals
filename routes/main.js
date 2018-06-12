const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');
const checkJwt = require('../middleware/check-jwt');
const isAdmin = require('../middleware/is-admin');

router.route('/genre')
    .get((req, res, next) => {
        Genre.find({}, (err, genres) => {
            res.json({
                success: true,
                message: 'Enjoy',
                genres: genres
            });
        });
    })
    .post([checkJwt, isAdmin], (req, res, next) => {
        const genre = new Genre();
        genre.name = req.body.name
        genre.save();

        res.json({
            success: true,
            message: 'Genre successfully added'
        });
    });

module.exports = router