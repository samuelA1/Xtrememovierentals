const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');
const Movie = require('../models/movie');
const Order = require('../models/order');
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
        genre.name = req.body.name;

        Genre.findOne({name: req.body.name}, (err, genreExist) => {
            if (genreExist) {
                res.json({
                    success: false,
                    message: 'This genre already exist'
                })
            } else {
                genre.save();
                res.json({
                    success: true,
                    message: 'Genre successfully added',
                    genre: genre
                });
            }
        })
        
    });

    router.delete('/genre/:id', [checkJwt, isAdmin], (req, res, next) => {
        Genre.findByIdAndDelete(req.params.id, (err) => {
            if (err) throw err;

            res.json({
                success: true,
                message: 'Genre successfully deleted'
            })
        })
    })

    router.get('/genre/:id', (req, res, next) => {
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
                .sort({releaseDate: -1})
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
            })
        })
    });

router.get('/movie/:id', (req, res, next) => {
    Movie.findById({_id: req.params.id})
    .populate('genre')
    .populate('crew')
    .populate('crew.actors')
    .populate('crew.directors')
    .exec((err, movie) => {
        if (err) return next(err);

        res.json({
            success: true,
            message: 'Enjoy',
            movie: movie
        });
    });
});

router.post('/payment', checkJwt, (req, res, next) => {
    const currentCharges = req.body.totalPrice;
    const movies = req.body.movies;

    let order = new Order();
    order.owner = req.decoded.user._id;
    order.totalPrice = currentCharges;
    
    movies.map(movie => {
        order.movies.push({
        title: movie['movieTitle'],
        price: movie['moviePrice'],
        image: movie['movieImage']
        });
    });

    order.save();
    res.json({
        success: true,
        message: "Successfully made a payment"
    });
    });


module.exports = router