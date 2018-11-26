const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    totalPrice: {type: Number, default: 0},
    movies: [{
        movie: {type: Schema.Types.ObjectId, ref: 'Movie'},
        quantity: {type: Number, default: 1}
    }]
});

module.exports = mongoose.model('Order', OrderSchema);