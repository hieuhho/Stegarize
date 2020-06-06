const express = require('express');
const path = require('path');
const db = require('../db');

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('req: ', req.body);
  res.end('my dude');
});

app.listen(port, () => console.log(`Listening on ${port}`));
