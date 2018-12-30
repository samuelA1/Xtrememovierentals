const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    totalPrice: {type: Number, default: 0},
    movies: [{
        title: String,
        price: Number,
        image: String,
    }]
});

module.exports = mongoose.model('Order', OrderSchema);