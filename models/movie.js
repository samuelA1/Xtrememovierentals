const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    image: String,
    description: String,
    price: Number,
    contentRating: String,
    movieLength: String,
    numberInStockAsHd: {type: Number, default: 0},
    numberInStockAsBluRay: {type: Number, default: 0}
});

module.exports = mongoose.model('Movie', MovieSchema);