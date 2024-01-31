const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./api/routes/user');

const dotenv = require('dotenv'); 
dotenv.config();

const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionString);

mongoose.connection.on('error', (error) => {
  console.log('Connection failed:', error);
});

mongoose.connection.on('connected', () => {
  console.log('Connected with database..');
});

const app = express();

app.use(bodyParser.json());

app.use('/user', userRoute);

app.use((req, res, next) => {
  res.status(200).json({
    message: 'API is running'
  });
});

module.exports = app;
