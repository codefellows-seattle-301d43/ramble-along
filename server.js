'use strict';

const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const sassMiddleware = require('node-sass-middleware');
const ctrl = require('./controllers');

app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed',
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(express.static('./public'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.set('view engine', 'ejs');

app.get('/', ctrl.getHappeningsIndex);
app.get('/new-happening', ctrl.getNewHappening);
app.post('/happening', ctrl.addNewHappening);
app.get('/happened', ctrl.getHappened);
app.get('/about-us', ctrl.getAboutUs);
app.get('/my-happenings', ctrl.getMyHappenings);
app.get('/happening/:id', ctrl.getSingleHappening);
app.post('/hap', ctrl.addNewHap);
app.put('/hap/:id', ctrl.updateHap);
app.delete('/happening/:id', ctrl.deleteHappening);

app.get('*', (request, response) => {
  response.statusCode = 404
  console.log(response.statusCode)
  response.render('pages/error', {
    error: '404 - Wrong path'
  })
})

app.listen(PORT, () => {
  console.log(`We're happening on port ${PORT}!`);
});