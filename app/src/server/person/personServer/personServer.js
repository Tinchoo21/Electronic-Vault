const path = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');

const loginServerLocation = path.join(__dirname, '..', '..', 'loginServer', 'loginServer.js')
const databaseLocation = path.join(__dirname, '..', '..', '..', 'database', 'database.js')

const client = require(databaseLocation)
const app = require(loginServerLocation)
app.use(bodyParser.json());



app.get('/person', (req, res) => {
    const location = path.join(__dirname, '..', 'person.html')
    res.sendFile(location);

});

app.get('/person.css', (req, res) => {
    const location = path.join(__dirname, '..', 'person.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});


exports.modules = app