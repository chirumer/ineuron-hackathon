const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();

app.use(bodyParser.json());

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