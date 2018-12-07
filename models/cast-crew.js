const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CrewSchema = new Schema({
    directors: [{type: String}],
    actors: [{type: String}]
});

module.exports = mongoose.model('Crew', CrewSchema);