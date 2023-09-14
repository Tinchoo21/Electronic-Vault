const path = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');

const loginServerLocation = path.join(__dirname, '..', '..', 'loginServer', 'loginServer.js')
const databaseLocation = path.join(__dirname, '..', '..', '..', 'database', 'database.js')

const client = require(databaseLocation)
const app = require(loginServerLocation)
app.use(bodyParser.json());





app.get('/trezor', (req, res) => {
    const location = path.join(__dirname, '..', 'trezor.html')
    res.sendFile(location);

});



app.get('/trezor.css', (req, res) => {
    const location = path.join(__dirname, '..', 'trezor.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
});

app.get('/otpis.html', (req, res) => {
    const location = path.join(__dirname, '..', 'trezorOtpis','otpis.html')
    res.sendFile(location);

});

app.get('/trezorDashboard.html', (req, res) => {
    const location = path.join(__dirname, '..', 'trezorDashboard', 'trezorDashboard.html')
    res.sendFile(location);

});

app.get('/trezorDashboard.css', (req, res) => {
    const location = path.join(__dirname, '..', 'trezorDashboard', 'trezorDashboard.css')
    res.sendFile(location);

});

app.get('/dashboard.css', (req, res) => {
    const location = path.join(__dirname, '..', 'trezorDashboard', 'dashboard.css')
    res.sendFile(location);

});

app.get('/dashboardTable.css', (req, res) => {
    const location = path.join(__dirname, '..', 'trezorDashboard', 'dashboardTable.css')
    res.sendFile(location);

});


app.get('/nalog.html', (req, res) => {
    
    const location = path.join(__dirname,'..','trezorNalog', 'nalog.html')
   
    res.sendFile(location);
   
  });

  app.get('/nalog.css', (req, res) => {
    const location = path.join(__dirname,'..','trezorNalog','nalog.css') 
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
  });
  

  app.get('/reporting.html', (req, res) => {
    
    const location = path.join(__dirname,'..','trezorReporting','reporting.html')
   
    res.sendFile(location);
   
  });

  app.get('/reporting.css', (req, res) => {
    const location = path.join(__dirname,'..','trezorReporting','reporting.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
  });
  
  app.get('/trezor-reporting.css', (req, res) => {
    const location = path.join(__dirname,'..','trezorReporting','trezor-reporting.css')
    const mimeType = mime.getType(location);
    res.setHeader('Content-Type', mimeType);
    res.sendFile(location);
  });
  


  app.get('/clients', async (req, res) => {
    const clients = await getClients();
    res.json(clients);
  });
  
  app.get('/stanje/:productId/:mjesec/:godina', async (req, res) => {
    const stanja = await getStanje(req.params.productId, req.params.mjesec, req.params.godina);
    res.json(stanja);
  });
  
  app.get('/products/:clientId', async (req, res) => {
    const clientId = req.params.clientId;
    const products = await getProductsByClientId(clientId);
    res.json(products);
  });
  
  async function getClients() {
    try {
      const result = await client.query('SELECT id, client_name FROM clientslist');
      return result.rows;
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
  ////konacno stanje dodano
  async function getStanje(id, mjesec, godina) {
    try {
      const result = await client.query(
        'SELECT skart, utroseno, stanje, konacno_stanje FROM stanje_plastika WHERE produkt = $1 AND mjesec = $2 AND godina = $3',
        [id, mjesec, godina]
      );
      return result.rows;
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
  
  async function getProductsByClientId(clientId) {
    try {
      const result = await client.query(
        'SELECT product_id, name FROM products_name WHERE client_id = $1',
        [clientId]
      );
      return result.rows;
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }


  app.get('/products', (req, res) => {
    client.query('SELECT * FROM products', (error, results) => {
      if (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results.rows);
      }
    });
  });

  
app.post('/trezor/submit', (req, res) => {

    const { type, product_name, delivery_note_number, loa, number_of_products, created_at, updated_at, client_id, exp_date } = req.body;

    client.query(
        'INSERT INTO products (id, type, product_name, delivery_note_number, loa, number_of_products, created_at, updated_at, client_id, expiry_date) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM products), $1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [type, product_name, delivery_note_number, loa, number_of_products, created_at, created_at, client_id, exp_date],


        (error, result) => {

            if (error) {
                if (error.message === "duplicate key value violates unique constraint 'products_pkey'") {

                }
                res.status(500).send(error.message);

            } else {

                res.redirect('/trezor');
            }

        });

});


app.get('/products', (req, res) => {
    client.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results.rows);
        }
    });
});

app.get('/union.png', (req, res) => {
    
  const location = path.join(__dirname,'..','media','union.png')
 
  res.sendFile(location);
 
});

app.get('/bbi.png', (req, res) => {
    
    const location = path.join(__dirname,'..','media','bbi.png')
   
    res.sendFile(location);
   
  });

  app.get('/asa.png', (req, res) => {
    
    const location = path.join(__dirname,'..','media','asa.png')
   
    res.sendFile(location);
   
  });

exports.modules = app