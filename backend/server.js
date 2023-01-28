const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js')

require('dotenv').config();

app.use(bodyParser.json());

const client = new Client({});

client
  .elevation({
    params: {
      locations: [{ lat: 45, lng: -110 }],
      key: process.env.GOOGLE_MAPS_API_KEY
    },
    timeout: 1000 // milliseconds
  }, axios.create())
  .then(r => {
    console.log(r.data.results[0].elevation);
  })
  .catch(e => {
    console.log(e);
  });

app.get('/', (req, res) => {
  res.send('Server Active')
});

app.post('/get_route', (req, res) => {
  const { from, to } = req.body;

});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
});