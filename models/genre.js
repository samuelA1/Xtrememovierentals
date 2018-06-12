const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GenreSchema = new Schema({
    name: {type: String, lowercase: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Genre', GenreSchema);