const mongoose = require('mongoose');
const config = require('./config');
const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/admin');
const searchRoute = require('./routes/movie-search');
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
app.use(morgan('dev'));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/account', userRoutes);
app.use('/api', mainRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', searchRoute);

app.listen(config.port, err => {
    console.log(`Listening on port ${config.port}`)
});