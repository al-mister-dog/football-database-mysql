const db = require('../utils/database');

exports.getLeagues = (req, res, next) => {
  const sql = 'SELECT * FROM leagues'
  db.query(sql, (err, result) => { 
    if (err) throw err;
    console.log(result);
    res.send(result)
  })
};
