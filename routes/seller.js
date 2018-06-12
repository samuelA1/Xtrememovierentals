const router = require('express').Router();
const Movie = require('../models/movie');
const checkJwt = require('../middleware/check-jwt');

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
  .get()
  .post([checkJwt, upload.single('product_picture')], (req, res) => {
      const movie = new Movie();
      movie.owner = req.decoded.user._id;
      movie.title = req.body.title;
      movie.genre = req.body.genreId;
      movie.price = req.body.price;
      movie.description = req.body.description
      movie.image = req.file.location;
      movie.numberInStockAsHd = movie.numberInStockAsHd + 1
      movie.contentRating = req.body.contentRating;
      movie.movieLength = req.body.movieLength;
      movie.save();
      res.json({
        success: true,
        message: 'Movie successfully added'
      });
  });

module.exports = router