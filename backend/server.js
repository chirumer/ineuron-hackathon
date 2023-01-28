const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
const res = require('express/lib/response');

require('dotenv').config();

app.use(bodyParser.json());

const client = new Client({});

async function get_place_id(lat, lng) {
  const { data } = await client
    .geocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000
    });
  return data.results[0].place_id;
}

async function get_directions(origin, destination) {
  try {
    const { data } = await client
    .directions({
      params: {
        origin: `place_id:${origin}`,
        destination: `place_id:${destination}`,
        travelMode: 'WALKING',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000
    });
    return data;
  } catch(e) {
    console.log(e);
  }
}

app.get('/', (req, res) => {
  res.send('Server Active')
});

app.post('/get_route', async (req, res) => {
  const { from, to } = req.body;

  const from_place_id = await get_place_id(from.lat, from.lng);
  const to_place_id = await get_place_id(to.lat, to.lng);

  const data = await get_directions(from_place_id, to_place_id);
  console.log(data.routes[0].bounds);
  console.log(data.routes[0].legs);
  console.log(data.routes[0].legs[0].steps[0]);
  console.log(data.routes[0].overview_polyline);

  res.status(200).end();
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
});