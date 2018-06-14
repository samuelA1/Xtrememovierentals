const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');
const Movie = require('../models/movie');
const checkJwt = require('../middleware/check-jwt');
const isAdmin = require('../middleware/is-admin');
const async = require('async');

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

    router.get('/genres/:id', (req, res, next) => {
        const perPage = 10;
        const page = req.query.page;
        async.parallel([
            function(callback) {
                Movie.count({genre: req.params.id}, (err, count) => {
                    callback(err, count);
                });
            },
            function (callback) {
                Movie.find({genre: req.params.id})
                .limit(perPage)
                .skip(page * perPage)
                .populate('user')
                .populate('genre')
                .exec((err, movies) => {
                    callback(err, movies)
                });
            },
            function (callback) {
                Genre.findById(req.params.id, (err, genre) => {
                    callback(err, genre);
                });
            }
        ], function(err, results) {
            const count = results[0];
            const movies = results[1];
            const genre = results[2];
            res.json({
                success: true,
                message: 'Enjoy',
                totalMovies: count,
                movies: movies,
                genre: genre,
                pages: Math.ceil(count / perPage)
            })
        })
    });



module.exports = router