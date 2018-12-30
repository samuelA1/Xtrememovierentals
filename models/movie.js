const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const algolia = require('mongoose-algolia');

const MovieSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    image: String,
    description: String,
    price: Number,
    rentPrice: Number,
    reviews: {type: Number, default: 0},
    crew: {type: Schema.Types.ObjectId, ref: 'Crew'},
    contentRating: String,
    movieLength: String,
    numberInStockAsHd: {type: Number, default: 0},
    numberInStockAsBluRay: {type: Number, default: 0},
    releaseDate: String,
    trailerUrl: String
}, {toJSON: {virtuals: true},
    toObject: {virtuals: true}});

MovieSchema.virtual('averageRating').get(function() {
  var rating = 0;
  if (!this.reviews) {
    rating = 0;
  } else {
    rating = this.reviews / 2;
  }
  return rating;
});

MovieSchema.plugin(algolia, {
  appId: '45PFEO9EZL',
  apiKey: '8557f62f77a0d0d6e90e6ee2a9be8822',
  indexName: 'rentals',
  selector: '_id title image rentPrice price',
  defaults: {
    author: 'uknown'
  },
  mappings: {
    title: function(value) {
      return `${value}`
    }
  },
  debug: true
});

MovieSchema.plugin(algolia);
let Model = mongoose.model('Movie', MovieSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
  searchableAttributes: ['title']
});

module.exports = Model;