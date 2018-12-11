const router = require('express').Router();
const Movie = require('../models/movie');
const Crew = require('../models/cast-crew');
const checkJwt = require('../middleware/check-jwt');
const isAdmin = require('../middleware/is-admin');
const async = require('async');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({accessKeyId: 'AKIAJZDTFCF42565X2AA', 
                       secretAccessKey: '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'});
                       
var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'xtrememovierentals',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) { 
        cb(null, Date.now().toString())
      }
    })
  });

router.route('/movies')
  .get(checkJwt, (req, res, next) => {
    const page = req.query.page
    const perPage = 10;
    async.parallel([
      function(callback) {
        Movie.count({owner: req.decoded.user._id}, (err, count) => {
          callback(err, count)
        })
      },
      function(callback) {
        Movie.find({owner: req.decoded.user._id})
        .limit(perPage)
        .skip(perPage * page)
        .populate('genre')
        .populate('owner')
        .select(['owner','title', 'image', 'price', 'rentPrice', '_id'])
        .exec((err, movies) => {
          callback(err, movies)
        })
      }
    ], function(err, results) {
      const count = results[0];
      const movies = results[1];
      res.json({
        success: true,
        message: 'Enjoy',
        movies: movies,
        totalItems: count,
        pages: Math.ceil(count / perPage)
      });
    });
  })
  .post([checkJwt, isAdmin, upload.single('product_picture')], (req, res) => {
      const movie = new Movie();
      const crew = new Crew();

      movie.owner = req.decoded.user._id;
      movie.title = req.body.title;

      if (req.body['0']) movie.genre.push(req.body['0']);
      if (req.body['1']) movie.genre.push(req.body['1']);
      if (req.body['2']) movie.genre.push(req.body['2']);

      movie.price = req.body.price;
      if (req.body.price) movie.rentPrice = req.body.price - 2.11
      movie.description = req.body.description;
      movie.image = req.file.location;

      if (req.body.numberInStockAsHd) movie.numberInStockAsHd = req.body.numberInStockAsHd;
      if (req.body.numberInStockAsBluRay) movie.numberInStockAsBluRay = req.body.numberInStockAsBluRay;

      movie.contentRating = req.body.contentRating;
      movie.movieLength = req.body.movieLength;

      if(req.body.director1) crew.directors.push(req.body.director1);
      if(req.body.director2) crew.directors.push(req.body.director2);

      if (req.body.actor1) crew.actors.push(req.body.actor1);
      if (req.body.actor2) crew.actors.push(req.body.actor2);
      if (req.body.actor3) crew.actors.push(req.body.actor3);
      if (req.body.actor4) crew.actors.push(req.body.actor4);
      if (req.body.actor5) crew.actors.push(req.body.actor5);

      if (req.body.Date) movie.releaseDate = req.body.Date;

      movie.crew = crew._id;

      movie.save();
      crew.save();
      res.json({
        success: true,
        message: 'Movie successfully added',
      });
  })

  router.post('/update/:id', [checkJwt, isAdmin], (req, res, next) => {
    async.waterfall([
      function(callback) {
        Movie.findOne({_id: req.params.id}, (err, movie) => {
          callback(err, movie)
        })
      },
      function(movie) {
        var crewId = movie.crew
        Crew.findOne({_id: crewId}, (err, crew) => {
          if (err) return next(err);

          let movie = movie;
          let actualCrew = crew;

          movie.title = req.body.title;

      if (req.body['0']) movie.genre.push(req.body['0']);
      if (req.body['1']) movie.genre.push(req.body['1']);
      if (req.body['2']) movie.genre.push(req.body['2']);

      movie.price = req.body.price;
      if (req.body.price) movie.rentPrice = req.body.price - 2.11
      movie.description = req.body.description;
      movie.image = req.file.location;

      if (req.body.numberInStockAsHd) movie.numberInStockAsHd = req.body.numberInStockAsHd;
      if (req.body.numberInStockAsBluRay) movie.numberInStockAsBluRay = req.body.numberInStockAsBluRay;

      movie.contentRating = req.body.contentRating;
      movie.movieLength = req.body.movieLength;

      if(req.body.director1) actualCrew.directors.push(req.body.director1);
      if(req.body.director2) actualCrew.directors.push(req.body.director2);

      if (req.body.actor1) actualCrew.actors.push(req.body.actor1);
      if (req.body.actor2) actualCrew.actors.push(req.body.actor2);
      if (req.body.actor3) actualCrew.actors.push(req.body.actor3);
      if (req.body.actor4) actualCrew.actors.push(req.body.actor4);
      if (req.body.actor5) actualCrew.actors.push(req.body.actor5);

      if (req.body.Date) movie.releaseDate = req.body.Date;

      movie.save();
      crew.save();
      res.json({
        success: true,
        message: 'Movie successfully updated',
      });
        })
      }
    ])
  })
  
  router.delete('/movie/:id', checkJwt, (req, res) => {
    async.waterfall([
      function(callback) {
        Movie.find({_id: req.params.id}, (err, movie) => {
          var crewId = movie.crew;
          callback(err, crewId)
        })
      },
      function(crewId) {
        Movie.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            res.json({
              success: false,
              message: 'Failed to delete movie'
            });
          } else {

            Crew.findByIdAndRemove(crewId, (err) => {
              if (err) {
                res.json({
                  success: false,
                  message: 'Failed to delete movie'
                });
              } else {
                res.json({
                  success: true,
                  message: 'Movie successfully deleted'
                })
              }
            })
          }
        })
      }
    ])
  });

module.exports = router