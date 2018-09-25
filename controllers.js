'use strict';

const pg = require('pg');
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);

client.connect();
client.on('error', err => console.log(err));

function getHappeningsIndex(req, res) {
  const SQL = 'SELECT * FROM happenings ORDER BY random() LIMIT 3';
  client.query(SQL, null, (err, result) => {
    if (err) {
      console.log('ERROR!!!', err);
    } else {
      const happenings = [];
      res.render('index', {
        happenings: result.rows,
      });
    }
  });
};

function getNewHappening(req, res) {
  res.render('pages/new-happening');
};

function getHappened(req, res) {
  res.render('pages/happened');
};

function getAboutUs(req, res) {
  res.render('pages/about-us');
};

function getMyHappenings(req, res) {
  res.render('pages/my-happenings');
};

function getSingleHappening(req, res) {
  res.render('pages/single-happening');
};

module.exports = {
  getHappeningsIndex,
  getNewHappening,
  getHappened,
  getAboutUs,
  getMyHappenings,
  getSingleHappening,
};