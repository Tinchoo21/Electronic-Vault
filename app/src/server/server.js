const client = require('../database/database')
const http = require('http');
const fs = require('fs');
const url = require('url');
const session = require('express-session');
const path = require('path');
const mime = require('mime');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');


client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err));


app.get('/', (req, res) => {

    const location = path.join(__dirname, '..', 'index.html')

    res.sendFile(location);

});

app.get('/index.css', (req, res) => {
    const location = path.join(__dirname, '..', 'index.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});
app.get('/index.js', (req, res) => {

    const location = path.join(__dirname, '..', 'index.js')
    res.sendFile(location);
});
app.get('/bamcardlogo.png', (req, res) => {

    const location = path.join(__dirname, '.', 'images', 'bamcardlogo.png')
    res.sendFile(location);
});
app.get('/hide.png', (req, res) => {

    const location = path.join(__dirname, '.', 'images', 'hide.png')
    res.sendFile(location);
});
app.get('/show.png', (req, res) => {

    const location = path.join(__dirname, '.', 'images', 'show.png')
    res.sendFile(location);
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.listen(3000, () => {
    console.log('Express.js server listening on port 3000');
});



app.use(bodyParser.urlencoded({ extended: false }));


exports.app = app
exports.client = client


const loginServer = require('./loginServer/loginServer')
