const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRouter = require('./routers/book');

const app = express();
const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_NAME = 'store';

mongoose.connect('mongodb://' + DATABASE_HOST + '/' + DATABASE_NAME);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', bookRouter);

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});
