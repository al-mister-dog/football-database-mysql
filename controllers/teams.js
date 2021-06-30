const db = require('../utils/database');

exports.getTeam = (req, res, next) => {
  const id = req.params.id
  const sql = `SELECT * FROM teams WHERE id = ${id}`
  db.query(sql, (err, result) => { 
    if (err) throw err;
    console.log(result);
    res.send(result)
  })
};

exports.getTeams = (req, res, next) => {
  const sql = `SELECT * FROM teams WHERE leagueId = ${req.params.id}`;
  db.query(sql, (err, result) => { 
    if (err) throw err;
    res.send(result)
  })
};

exports.getMarketValue = (req, res, next) => {
  const id = req.params.id
  const sql = `SELECT SUM(value) AS marketValue FROM players WHERE teamId = ?`
  db.query(sql, [id], (err, result) => { 
    if (err) throw err;
    res.send(result)
  })
};
