const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');
const Movie = require('../models/movie');
const Review = require('../models/review');
const Order = require('../models/order');
const checkJwt = require('../middleware/check-jwt');
const isAdmin = require('../middleware/is-admin');
const async = require('async');
const stripe = require('stripe')('sk_test_JhQBQU6jpKWVJgOr7vAz1PuO');


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
    .populate('reviews')
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

router.post('review/:id', checkJwt, (req, res, next) => {
        async.waterfall([
            function(callback) {
                Movie.findById(req.params.id, (err, movie) => {
                    if (err) next(err);

                    callback(err, movie);
                })
            },
            function (movie) {
                const review = new Review();
                review.owner = req.decoded.user._id;
                review.content = req.body.content;
                review.rating = req.body.rating
                
                movie.reviews.push(review._id);
                movie.save();
                review.save();
                res.json({
                    success: true,
                    message: 'Review successfully added'
                });
            }
        ])
    });

    router.post('/payment', checkJwt, (req, res, next) => {
        const currentCharges = req.body.totalPrice;
        const movies = req.body.movies;
    
        let order = new Order();
        order.owner = req.decoded.user._id;
        order.totalPrice = currentCharges;
        
        movies.map(movie => {
            order.movies.push({
            movie: movie.movieId,
            quantity: movie.quantity
            });
            Movie.find({_id: movieId}, (err, video) => {
                if (movie.asHd) {
                    video.numberInStockAsHd -=1
                } else if (movie.asBluRay) {
                    video.numberInStockAsBluRay -=1
                }
            })
        });
    
        order.save();
        movie.save();
        res.json({
            success: true,
            message: "Successfully made a payment"
        });
      });


module.exports = router