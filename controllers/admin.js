const db = require('../utils/database');

exports.addPlayer = (req, res, next) => {
  let sql = 'INSERT INTO players (firstName, lastName, team, position, age, nation, squadNumber, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  const player = [
    req.body.firstName, 
    req.body.lastName,
    req.body.team,
    req.body.position,
    req.body.age,
    req.body.nation,
    req.body.squadNumber,
    req.body.value,
  ]
  db.query(sql, player, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send({success: true})
  })
};

exports.updatePlayer = (req, res, next) => {
  let sql = `UPDATE players SET firstName = ?, lastName = ?, team = ?, position = ?, age = ?, nation = ?, squadNumber = ?, value = ? WHERE id = ${req.body.id}`
  const player = [
    req.body.firstName, 
    req.body.lastName,
    req.body.team,
    req.body.position,
    req.body.age,
    req.body.nation,
    req.body.squadNumber,
    req.body.value,
  ]
  db.query(sql, player, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send({success: true})
  })
};

exports.deletePlayer = (req, res, next) => {
  const id = req.params.id
  const sql = `DELETE FROM players WHERE id = ?`;
  db.query(sql, id, (err, result) => { 
    if (err) throw err; 
    console.log(result); 
    res.send({success: true})
  })
};