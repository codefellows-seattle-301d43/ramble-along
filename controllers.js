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
  let SQL = 'INSERT INTO happenings (title, user_id, max_char, max_haps, is_finished, first_hap) VALUES ($1, $2, $3, $4, $5, $6)';
  let values = [req.body.title, req.body.user_id, req.body.max_char, req.body.max_haps, false, req.body.first_hap];
  client.query(SQL, values, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/my-happenings?happeningId=${req.body.user_id}`);
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
  let SQL = 'SELECT * FROM happenings WHERE user_id = $1';
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
  let SQL = 'SELECT * FROM happenings WHERE id = $1';
  let SQL2 = 'SELECT * FROM haps WHERE happenings_id = $1';
  let values = [ req.params.id ]
  client.query(SQL, values, (err, result) => {
    if(err){
      console.log(err);
      res.redirect('/error');
    } else {
      client.query(SQL2, values, (err, results) => {
        res.render('pages/single-happening', {happenings: result.rows[0], haps: results.rows});
      })
    }
  })
};

function addNewHap(req, res) {
  let SQL = 'INSERT INTO haps (body, user_id, editable, happenings_id, position) VALUES ($1, $2, $3, $4, $5)';
  let values = [req.body.body, req.body.user_id, true, req.body.happenings_id, req.body.position];
  client.query('UPDATE haps SET editable=false WHERE id=$1', [req.body.old_hap_id], (err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/error');
    } else {
      client.query(SQL, values, (err, data) => {
        res.redirect(`/happening/${req.body.happenings_id}`);
      });
    }
  });
}

function updateHap(req, res) {
  console.log('UPDATE');
  console.log(req.params.id);
  client.query('SELECT editable FROM haps WHERE id=$1', [req.params.id], (err, result) => {
    if (err) {
      console.log(err);
      res.redirect('/error');
    } else {
      if (!result.rows[0].editable) {
        res.redirect('/error');
      } else {
        let SQL = 'UPDATE haps SET body=$1 WHERE id=$2';
        let values = [req.body.body, req.params.id];
          client.query(SQL, values, (err, result) => {
            res.redirect(`/happening/${req.body.id_of_happening}`);
        });
      }
    }
  });
};

function deleteHappening(req, res) {
  console.log('DELETED');
}

module.exports = {
  getHappeningsIndex,
  getNewHappening,
  addNewHappening,
  getHappened,
  getAboutUs,
  getMyHappenings,
  getSingleHappening,
  addNewHap,
  updateHap,
  deleteHappening
};