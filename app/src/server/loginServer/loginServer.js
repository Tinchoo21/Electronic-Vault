const path = require('path');
const { app, client } = require('../server')
const mime = require('mime');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let loginUser1 = "";
let loginUser1Department = "";
let arrayOfUserID = []
app.post('/submit', async (req, res) => {

    const { username, password } = req.body;


    const result = await client.query(
        'SELECT id ,username, password, department FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );


    if (result.rowCount === 1) {
        const now = new Date();
        client.query('UPDATE users SET last_login = $1 WHERE username = $2', [now, username], (err, result) => {
            if (err) {

                res.status(500).send(JSON.stringify({ message: 'failure' }));
            } else {

            }
        });
        if (result.rows[0].department === "Admin") {

            req.session.userId = result.rows[0].id;

            res.status(200).send(JSON.stringify({ message: 'success', redirect: '/admin' }));


        }
        else {

            loginUser1 = result.rows[0].username;
            loginUser1ID = result.rows[0].id;
            arrayOfUserID.splice(0, arrayOfUserID.length);
            arrayOfUserID.push(loginUser1ID);
            loginUser1Department = result.rows[0].department;
            res.status(200).send(JSON.stringify({ message: 'success', redirect: '/login' }));
        }



    }
    else {

        res.status(401).send(JSON.stringify({ message: 'failure' }));

    }

});
app.get('/login', (req, res) => {
    const location = path.join(__dirname, '..', 'secondLogin', 'login.html')
    res.sendFile(location);

});

app.post('/dualSubmit', async (req, res) => {
 
    const { username, password } = req.body;

    const result = await client.query(
        'SELECT id ,username, password, department FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );
    if (result.rowCount === 1) {

        if (result.rows[0].department === "Person") {

            if (loginUser1 === result.rows[0].username) {
                res.status(401).send(JSON.stringify({ message: 'sameUser' }));
            }
            else if (loginUser1Department === result.rows[0].department) {

                loginUser1 = ""
                const now = new Date();
                client.query('UPDATE users SET last_login = $1 WHERE username = $2', [now, username], (err, result) => {
                    if (err) {

                        res.status(500).send(JSON.stringify({ message: 'failure' }));
                    } else {

                    }
                });
                arrayOfUserID.push(result.rows[0].id);
                req.session.userId = arrayOfUserID;
                res.status(200).send(JSON.stringify({ message: 'success', redirect: '/person' }));
            }
            else {
                res.status(401).send(JSON.stringify({ message: 'diffDepartment' }));
            }
        }
        else if (result.rows[0].department === "Trezor")
        {
            if (loginUser1 === result.rows[0].username) {
                res.status(401).send(JSON.stringify({ message: 'sameUser' }));
            }
            else if (loginUser1Department === result.rows[0].department) {

                loginUser1 = ""
                const now = new Date();
                client.query('UPDATE users SET last_login = $1 WHERE username = $2', [now, username], (err, result) => {
                    if (err) {

                        res.status(500).send(JSON.stringify({ message: 'failure' }));
                    } else {

                    }
                });
                arrayOfUserID.push(result.rows[0].id);
                req.session.userId = arrayOfUserID;
                res.status(200).send(JSON.stringify({ message: 'success', redirect: '/trezor' }));
            }
            else {
                res.status(401).send(JSON.stringify({ message: 'diffDepartment' }));
            }

        }
        else {
            res.status(401).send(JSON.stringify({ message: 'failure' }));
        }
    }
    else {

        res.status(401).send(JSON.stringify({ message: 'failure' }));

    }

})
app.get('/login.css', (req, res) => {
    const location = path.join(__dirname, '..', 'secondLogin', 'login.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});
app.get('/login.js', (req, res) => {

    const location = path.join(__dirname, '..', 'secondLogin', 'login.js')
    res.sendFile(location);
});
app.get('/bamcardlogo.png', (req, res) => {

    const location = path.join(__dirname, '..', 'images', 'bamcardlogo.png')
    res.sendFile(location);
});


module.exports = app
//module.exports = mime


const adminServer = require('../admin/adminServer/adminServer')
const personServer = require('../person/personServer/personServer')
const trezorServer = require('../trezor/trezorServer/trezorServer')
