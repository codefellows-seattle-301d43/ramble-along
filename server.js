'use strict';

const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
const methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index')
});

app.listen(PORT, () => {
  console.log(`We're happening on port ${PORT}!`);
});