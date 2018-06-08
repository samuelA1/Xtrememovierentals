const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

mongoose.connect(config.db, err => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to database');
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());



app.listen(config.port, err => {
    console.log(`Listening on port ${config.port}`)
});