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
      result.rows.forEach(row => {
        let newObj = {};
        newObj.title = row.title
        newObj.id = row.id
        newObj.max_char = row.max_char
        newObj.max_haps = row.max_haps
        newObj.first = row.first_hap
        client.query('SELECT * FROM haps WHERE happenings_id= $1 ORDER BY position DESC', [row.id], (err, haps) => {
          if (err) console.log(err)
          else {
            newObj.last = haps.rows.length ? haps.rows[0].body : null;
            newObj.position = haps.rows.length ? haps.rows[0].position : 1;
            happenings.push(newObj)
            if (happenings.length === 3) {
              res.render('index', { happenings });
            }
          }
        });
      });
    }
  });
}

module.exports = {
  getHappeningsIndex
}