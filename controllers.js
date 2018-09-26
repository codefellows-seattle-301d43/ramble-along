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
        newObj.first_hap = row.first_hap
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

function getNewHappening(req, res) {
  res.render('pages/new-happening');
};

function addNewHappening(req, res) {
  let SQL = 'INSERT INTO happenings (title, max_char, max_haps, is_finished, first_hap) VALUES ($1, $2, $3, $4, $5) RETURNING id';
  let values = [req.body.title, req.body.max_char, req.body.max_haps, false, req.body.first_hap];
  client.query(SQL, values, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/my-happenings?new=${result.rows[0].id}`);
    }
  })
}

function getHappened(req, res) {
  res.render('pages/happened');
};

function getAboutUs(req, res) {
  res.render('pages/about-us');
};

function getMyHappenings(req, res) {
  //res.render('pages/my-happenings');
  let SQL = 'SELECT * FROM happenings WHERE userId = $1';
  let values = [ req.query.happeningId ];
  client.query(SQL, values, (err, result) => {
    if(err){
      console.log(err);
      res.redirect('/error');
    } else {
      res.render('pages/my-happenings', {happenings: result.rows,});
    }
  });
};

function getSingleHappening(req, res) {
  // res.render('pages/single-happening');
  let SQL = 'SELECT * FROM happenings WHERE id = $1';
  let values = [ req.params.id ]
  client.query(SQL, values, (err, result) => {
    if(err){
      console.log(err);
      res.redirect('/error');
    } else {
      console.log('response', res.body)
      res.render('pages/single-happening', {happenings: result.rows[0]});
    }
  })
};


module.exports = {
  getHappeningsIndex,
  getNewHappening,
  addNewHappening,
  getHappened,
  getAboutUs,
  getMyHappenings,
  getSingleHappening,
};