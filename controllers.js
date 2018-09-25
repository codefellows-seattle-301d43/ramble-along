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
        happenings: result.rows
      })
    }
  })
}

module.exports = {
  getHappeningsIndex
}