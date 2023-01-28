const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { Client } = require('@googlemaps/google-maps-services-js');
const res = require('express/lib/response');

require('dotenv').config();

app.use(bodyParser.json());

const client = new Client({});

async function get_place_id_from_address(address) {
  try {
    const { data } = await client
    .geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000
    });
  return data.results[0].place_id;
  } catch (e) {
    console.log(e);
  }
}

async function get_place_id_from_latlng(lat, lng) {
  try {
    const { data } = await client
    .geocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000
    });
  return data.results[0].place_id;
  } catch (e) {
    console.log(e);
  }
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
    if (!data.routes) {
      throw new Error('No Route Found');
    }
    return data.routes[0].legs[0].steps.map(x => ({ end_location: x.end_location, instruction: x.html_instructions }));
  } catch(e) {
    console.log(e);
  }
}

app.get('/', (req, res) => {
  res.send('Server Active')
});

app.post('/get_route', async (req, res) => {
  const { from, to } = req.body;

  const from_place_id = await get_place_id_from_latlng(from.lat, from.lng);
  const to_place_id = await get_place_id_from_address(to);

  try {
    const end_locations = await get_directions(from_place_id, to_place_id);
    res.json(end_locations);
    return;
  } catch(e) {
    res.status(404).json({ failure_reason: 'No Routes Found' });
  }
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
});