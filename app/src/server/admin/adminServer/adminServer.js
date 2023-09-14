const path = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');

const loginServerLocation = path.join(__dirname, '..', '..', 'loginServer', 'loginServer.js')
const databaseLocation = path.join(__dirname, '..', '..', '..', 'database', 'database.js')


const client = require(databaseLocation)
const app = require(loginServerLocation)


app.use(bodyParser.json());





app.get('/admin', (req, res) => {
    const location = path.join(__dirname, '..', 'admin.html')
    res.sendFile(location);

});

app.get('/admin.css', (req, res) => {
    const location = path.join(__dirname, '..', 'admin.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});


app.get('/bamcardlogo.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'bamcardlogo.png')

    res.sendFile(location);
});
app.get('/vaultlogo.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'vaultlogo.png')

    res.sendFile(location);
});
app.get('/card.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'card.png')

    res.sendFile(location);
});
app.get('/dinners.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'dinners.png')

    res.sendFile(location);
});
app.get('/adminlogo.jpg', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'adminlogo.jpg')

    res.sendFile(location);
});
app.get('/mastercard.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'mastercard.png')

    res.sendFile(location);
});
app.get('/visalogo.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'visalogo.png')

    res.sendFile(location);
});
app.get('/americanlogo.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'americanlogo.png')

    res.sendFile(location);
});
app.get('/discover.png', (req, res) => {

    const location = path.join(__dirname, '..', '..', 'images', 'discover.png')

    res.sendFile(location);
});



app.get('/userLogin', (req, res) => {
    client.query('SELECT * FROM users WHERE last_login IS NOT NULL ORDER BY last_login DESC', (err, dbRes) => {
        if (err) {
            console.error(err);
            res.send(err);
            return;
        }
        res.json(dbRes.rows);
    });
});


/* Admin Tim - Dodaj uposlenika stranica */

app.get('/adminTim', (req, res) => {
    const location = path.join(__dirname, '..', 'adminTim', 'adminTim.html')
    res.sendFile(location);

});
app.get('/adminTim.css', (req, res) => {
    const location = path.join(__dirname, '..', "adminTim", 'adminTim.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});


app.post('/adduser', (req, res) => {
    const { name, surname, username, password, department } = req.body;
    client.query('INSERT INTO users (name, surname, username, password, department) VALUES ($1, $2, $3, $4, $5)', [name, surname, username, password, department], (error, result) => {
        if (error) {

            res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminTim' }));

        } else {

            res.status(200).send(JSON.stringify({ message: 'success', redirect: '/adminTim' }));

        }
    });
});
app.get('/totalNumUsers', (req, res) => {
    client.query('SELECT COUNT(*) FROM users', (error, result) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            const count = result.rows[0].count;
            res.send(count);
        }
    });
});

app.get('/totalAdminUsers', (req, res) => {
    client.query('SELECT COUNT(*) FROM users WHERE department = $1', ['Admin'], (error, result) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            const count = result.rows[0].count;
            res.send(count);
        }
    });
});
app.get('/totalTrezorUsers', (req, res) => {
    client.query('SELECT COUNT(*) FROM users WHERE department = $1', ['Trezor'], (error, result) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            const count = result.rows[0].count;
            res.send(count);
        }
    });
});

app.get('/totalPersonUsers', (req, res) => {
    client.query('SELECT COUNT(*) FROM users WHERE department = $1', ['Person'], (error, result) => {
        if (error) {
            res.status(500).send(error.message);
        } else {
            const count = result.rows[0].count;
            res.send(count);
        }
    });
});




/* Lista uposlenih stranica */


app.get('/adminListaUposlenih', (req, res) => {
    const location = path.join(__dirname, '..', 'adminListaUposlenih', 'adminListaUposlenih.html')
    res.sendFile(location);

});
app.get('/adminListaUposlenih.css', (req, res) => {
    const location = path.join(__dirname, '..', "adminListaUposlenih", 'adminListaUposlenih.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});

app.get('/nameAndSurname', (req, res) => {
    const userId = req.session.userId;

    client.query(
        'SELECT name, surname FROM users WHERE id = $1',
        [userId],
        (error, result) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (result.rows.length === 0) {
                res.send('User not found');
            } else {
                const user = result.rows[0];
                res.send(user.name + " " + user.surname);
            }
        }
    );
});
app.get('/namesAndSurnames', (req, res) => {
    const userIds = req.session.userId;

    client.query(
        'SELECT name, surname FROM users WHERE id = ANY($1::int[])',
        [userIds],
        (error, result) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (result.rows.length === 0) {
                res.send('User not found');
            } else {
                const users = result.rows.map(user => user.name + ' ' + user.surname);
                res.send(users);
            }
        }
    );
});


app.get('/tabela.js', (req, res) => {

    const location = path.join(__dirname, '..', 'adminListaUposlenih', 'tabela.js')
    res.sendFile(location);
});

app.get('/department', (req, res) => {
    const department = req.query.department;

    client.query(
        'SELECT * FROM users WHERE department = $1',
        [department],
        (error, result) => {
            if (error) {
                res.status(500).send(error.message);
            } else {
                const users = result.rows;
                res.send(JSON.stringify(users));
            }
        }
    );
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    client.query('SELECT * FROM users WHERE id = $1', [userId], (error, result) => {
        if (error) {
            res.status(500).send(error.message);
        } else if (result.rows.length === 0) {
            res.status(404).send(`User with ID ${userId} not found`);
        } else {
            const user = result.rows[0];
            res.send(user);
        }
    });
});


app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    client.query(
        'DELETE FROM users WHERE id = $1',
        [userId],
        (error, result) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (result.rowCount === 0) {
                res.status(404).send('User not found');
            } else {
                res.send(`User with ID ${userId} deleted successfully`);
            }
        }
    );
});





/* Kraj lista uposlenih stranice */




/* Klijenti stranica */

app.get('/adminKlijenti', (req, res) => {
    const location = path.join(__dirname, '..', 'adminKlijenti', 'adminKlijenti.html')
    res.sendFile(location);

});
app.get('/adminKlijenti.css', (req, res) => {
    const location = path.join(__dirname, '..', "adminKlijenti", 'adminKlijenti.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});

app.get('/banks', async (req, res) => {
    try {

        const query = `
        SELECT c.id, c.client_name, COALESCE(COUNT(DISTINCT p.name), 0) AS product_count
FROM clients c
LEFT JOIN products_name p ON c.id = p.client_id
GROUP BY c.id, c.client_name
ORDER BY c.id
`;

        const result = await client.query(query);
        const banks = result.rows;
        res.json(banks);
    } catch (err) {
        console.error(err);
        res.send('Error ' + err);
    }
});

app.get('/banks/:clientId/products', (req, res) => {
    const clientId = req.params.clientId;
    client.query('SELECT pn.name AS product_name,COALESCE(SUM(p.number_of_products), 0) AS total_number_of_products FROM products_name pn LEFT JOIN products p ON p.product_name = pn.name AND p.client_id = pn.client_id JOIN clients c ON pn.client_id = c.id WHERE c.id = $1 GROUP BY pn.name;', [clientId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        } else {
            res.json(results.rows);
        }
    });
});
app.get('/banks/:clientId/products/:productName', async (req, res) => {
    const { productName, clientId } = req.params;
    try {
        const { rows } = await client.query('SELECT * FROM products WHERE product_name = $1 AND client_id = $2', [productName, clientId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

/* Kraj klijent stranice */


/* Dodaj klijenta stranica */


app.get('/adminDodajKlijenta', (req, res) => {
    const location = path.join(__dirname, '..', 'adminDodajKlijenta', 'adminDodajKlijenta.html')
    res.sendFile(location);

});
app.get('/adminDodajKlijenta.css', (req, res) => {
    const location = path.join(__dirname, '..', "adminDodajKlijenta", 'adminDodajKlijenta.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});

app.get('/clients', async (req, res) => {
    const clients = await getClients();
    res.json(clients);
});
const getClients = async () => {

    try {
        const result = await client.query('SELECT id, client_name FROM clients');
        return result.rows;
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};


app.post('/addclient', (req, res) => {
    const name = req.body.name;
    const query = 'SELECT * FROM clients WHERE client_name = $1';
    const values = [name];
    client.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
        } else {
            if (result.rowCount > 0) {
                res.status(400).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
            } else {
                const query = 'INSERT INTO clients (client_name) VALUES ($1)';
                const values = [name];
                client.query(query, values, (error, result) => {
                    if (error) {
                        console.error(error);
                        res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
                    } else {
                        res.status(200).json({ message: 'success', redirect: '/adminDodajKlijenta' });
                    }
                });
            }
        }
    });
});
app.get('/productsname', async (req, res) => {
    const clientId = req.query.clientId;
    try {
        const { rows } = await client.query('SELECT * FROM products_name WHERE client_id = $1 ORDER BY product_id', [clientId]);

        res.json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
app.get('/paymentnetwork', async (req, res) => {
    const productId = req.query.productId;
    try {
        const { rows } = await client.query('SELECT * FROM products_name WHERE product_id = $1', [productId]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
app.delete('/productsname', (req, res) => {
    const { clientId, productId } = req.query;

    try {
        const result = client.query('DELETE FROM products_name WHERE client_id = $1 AND product_id = $2', [clientId, productId]);

        res.status(200).json({ message: 'success', redirect: '/adminDodajKlijenta' });
    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
    }
});
app.post('/addproduct', function (req, res) {
    const clientId = req.body.clientId;

    const productName = req.body.productName;
    const netOperator = req.body.netOperator;

    client.query('INSERT INTO products_name (name, client_id,payment_network) VALUES ($1, $2 , $3)', [productName, clientId, netOperator], function (error) {
        if (error) {
            console.log(error);
            res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
        } else {
            res.status(200).json({ message: 'success', redirect: '/adminDodajKlijenta' });
        }
    });
});

app.delete('/deleteclient', (req, res) => {
    const clientName = req.body.id;
    const query = 'DELETE FROM clients WHERE id = $1';
    const values = [clientName];
    client.query(query, values, (error, result) => {
        if (error) {
            res.status(500).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
        } else {
            if (result.rowCount === 0) {
                res.status(400).send(JSON.stringify({ message: 'failure', redirect: '/adminDodajKlijenta' }));
            } else {
                res.status(200).json({ message: 'success', redirect: '/adminDodajKlijenta' });
            }
        }
    });
});


/* Kraj Dodaj klijenta stranica */


/* Admin Analitika stranica */

app.get('/adminAnalitika', (req, res) => {
    const location = path.join(__dirname, '..', 'adminAnalitika', 'adminAnalitika.html')
    res.sendFile(location);

});
app.get('/adminAnalitika.css', (req, res) => {
    const location = path.join(__dirname, '..', "adminAnalitika", 'adminAnalitika.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});

app.get('/dataAnalytics', async (req, res) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const selectedClient = req.query.client;
    const selectedProducts = JSON.parse(req.query.product); 

    try {
        const query = `
      SELECT
        EXTRACT(YEAR FROM COALESCE(p.updated_at, pd.updated_at)) AS year,
        EXTRACT(MONTH FROM COALESCE(p.updated_at, pd.updated_at)) AS month,
        EXTRACT(DAY FROM COALESCE(p.updated_at, pd.updated_at)) AS day,
        COALESCE(SUM(p.number_of_products), 0) AS total_quantity_input,
        COALESCE(SUM(pd.number_of_products), 0) AS total_quantity_used,
        pd.type_of_use
      FROM
        (SELECT *
         FROM products_added
         WHERE client_id = $1
           AND product_name = ANY($2) -- Use the array directly
           AND updated_at BETWEEN $3 AND $4) p
        FULL OUTER JOIN
        (SELECT *
         FROM products_deleted
         WHERE client_id = $1
           AND product_name = ANY($2) -- Use the array directly
           AND updated_at BETWEEN $3 AND $4) pd
        ON p.client_id = pd.client_id AND p.updated_at = pd.updated_at
      GROUP BY
        EXTRACT(YEAR FROM COALESCE(p.updated_at, pd.updated_at)),
        EXTRACT(MONTH FROM COALESCE(p.updated_at, pd.updated_at)),
        EXTRACT(DAY FROM COALESCE(p.updated_at, pd.updated_at)),
        pd.type_of_use
      ORDER BY
        year ASC,
        month ASC,
        day ASC
    `;

        const { rows } = await client.query(query, [selectedClient, selectedProducts, startDate, endDate]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

/* Kraj Admin Analitika stranica */

app.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {

            res.redirect('/');
        }
    });
});

exports.modules = app