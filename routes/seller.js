const router = require('express').Router();
const Movie = require('../models/movie');
const checkJwt = require('../middleware/check-jwt');
const async = require('async');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({accessKeyId: 'AKIAJER55VHNGRSDMNQA', 
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
  .post([checkJwt, upload.array('product_picture')], (req, res) => {
      const movie = new Movie();
      movie.owner = req.decoded.user._id;
      movie.title = req.body.title;
      if (req.body.genreId != null && req.body.genreId2 != null) {
        movie.genre.push(req.body.genreId, req.body.genreId2);
      } else if (req.body.genreId != null && req.body.genreId2 == null || '') {
        movie.genre.push(req.body.genreId);
      }
      movie.price = req.body.price;
      movie.description = req.body.description
      movie.image = req.files[0].location;
      movie.coverImage = req.files[1].location;
      movie.numberInStockAsHd = movie.numberInStockAsHd + 1
      movie.contentRating = req.body.contentRating;
      movie.movieLength = req.body.movieLength;
      movie.save();
      res.json({
        success: true,
        message: 'Movie successfully added',
        numberOfImagesUploaded: req.files.length
      });
  })
  router.delete('/movie/:id', checkJwt, (req, res) => {
    Movie.findByIdAndRemove(req.params.id, (err) => {
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
  });

module.exports = router