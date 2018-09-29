'use strict';

const pg = require('pg');
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);

client.connect();
client.on('error', err => console.log(err));

function getHappeningsIndex(req, res) {
  const SQL = 'SELECT * FROM happenings WHERE is_finished=false ORDER BY random() LIMIT 3';
  client.query(SQL, null, (err, result) => {
    if (err) {
      console.log('ERROR!!!', err);
    } else {
      const happenings = [];
      if (!result.rows.length) {
        res.render('index', { happenings });
      } else {
        result.rows.forEach(row => {
          let newObj = {};
          newObj.title = row.title;
          newObj.id = row.id;
          newObj.max_char = row.max_char;
          newObj.max_haps = row.max_haps;
          newObj.first_hap = row.first_hap;
          client.query('SELECT * FROM haps WHERE happenings_id= $1 ORDER BY position DESC', [row.id], (err, haps) => {
            if (err) console.log(err);
            else {
              newObj.last = haps.rows.length ? haps.rows[0].body : null;
              newObj.position = haps.rows.length ? haps.rows[0].position : 1;
              happenings.push(newObj);
              // This pattern works, but you could have used Promise.all instead!
              // Promise.all(result.rows.map(row => client.query...)).then(allDbResults => {})
              if (happenings.length === result.rows.length) {
                res.render('index', { happenings });
              }
            }
          });
        });
      }
    }
  });
}

function getNewHappening(req, res) {
  res.render('pages/new-happening');
}

function addNewHappening(req, res) {
  let SQL = 'INSERT INTO happenings (title, user_id, max_char, max_haps, is_finished, first_hap) VALUES ($1, $2, $3, $4, $5, $6)';
  let values = [req.body.title, req.body.user_id, req.body.max_char, req.body.max_haps, false, req.body.first_hap];
  client.query(SQL, values, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect(`/my-happenings?happeningId=${req.body.user_id}`);
    }
  });
}

function getHappened(req, res) {
  const SQL = 'SELECT * FROM happenings WHERE is_finished=true ORDER BY random()';
  client.query(SQL, null, (err, result) => {
    if (err) {
      console.log('Error in the get happened', err);
    } else {
      const happenings = [];
      // this is a map!
      // const happenings = result.rows.map(row => ({id: row.id, title: row.title, first_hap: row.first_hap}));
      result.rows.forEach(row => {
        let newObj = {};
        newObj.id = row.id;
        newObj.title = row.title;
        newObj.first_hap = row.first_hap;
        happenings.push(newObj);
      });
      res.render('pages/happened', { happenings });
    }
  });
}

function getAboutUs(req, res) {
  res.render('pages/about-us');
}

function getMyHappenings(req, res) {
  let SQL = 'SELECT * FROM happenings WHERE user_id = $1';
  // It worries me that you're using happeningId from the front end, but it really means user_id on the backend... Consider naming that more consistently.
  let values = [ req.query.happeningId ];
  client.query(SQL, values, (err, result) => {
    let happenings = result.rows.length ? result.rows : [];
    if(err){
      console.log(err);
      res.redirect('/error');
    } else {
      res.render('pages/my-happenings', {happenings,});
    }
  });
}

function getSingleHappening(req, res) {
  let SQL = 'SELECT * FROM happenings WHERE id = $1';
  let SQL2 = 'SELECT * FROM haps WHERE happenings_id = $1';
  let values = [ req.params.id ];
  client.query(SQL, values, (err, result) => {
    if(err){
      console.log(err);
      res.redirect('/error');
    } else {
      client.query(SQL2, values, (err, results) => {
        let previous = results.rows.length ? results.rows[results.rows.length - 1] : { id: 0, user_id: null, body: ''};
        // A couple of concerns here:
        // - Why is the key 'happenings' if you're rendering a single happening?
        // - This feels like you could've joined the happening into each hap, instead of having to make two queries in series.
        // - you only have error handling for the first query, not the second
        res.render('pages/single-happening', {happenings: result.rows[0], haps: results.rows, previous});
      });
    }
  });
}

function addNewHap(req, res) {
  let SQL = 'INSERT INTO haps (body, user_id, happenings_id, position) VALUES ($1, $2, $3, $4)';
  let values = [req.body.body, req.body.user_id, req.body.happenings_id, req.body.position];
  const finished = (req.body.max_haps === req.body.position);
  // Oof, if you've got a max of 40 haps in one story, you'll make this query 39 times where it does nothing, and a single time at the end where it's meaningful. Consider restructuring to only make this query if finished is true.
  client.query('UPDATE happenings SET is_finished=$1 WHERE id=$2', [finished, req.body.happenings_id], (err) => {
    if (err) {
      console.log(err);
      res.redirect('/error');
    } else {
      client.query(SQL, values, () => {
        // again, no error handling for your second query
        res.redirect(`/happening/${req.body.happenings_id}`);
      });
    }
  });
}

function updateHap(req, res) {
  let SQL = 'UPDATE haps SET body=$1 WHERE id=$2';
  let values = [req.body.body, req.params.id];
  client.query(SQL, values, () => {
    // oh, interesting that you pull this from the FE! You could try 'RETURNING happenings_id' in your SQL instead, so you don't need as much plumbing.
    res.redirect(`/happening/${req.body.id_of_happening}`);
  });
}

function deleteHappening(req, res) {
  client.query('DELETE FROM haps WHERE happenings_id=$1', [req.params.id], (err) => {
    if (err) {
      res.redirect('/error');
    } else {
      client.query('DELETE FROM happenings WHERE id=$1', [req.params.id], (err) => {
        if (err) {
          console.log(err);
          // here, you have error handling on your second query, but it will leave the user hanging.
        } else {
          res.redirect('/');
        }
      });
    }
  });
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