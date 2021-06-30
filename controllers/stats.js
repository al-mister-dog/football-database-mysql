const db = require('../utils/database');

exports.getStats = (req, res, next) => {
  const queries = {
    teamAge: 'SELECT team AS team, SUM(age) AS "combined age" FROM players GROUP BY team ORDER by SUM(age) DESC',
    averageAge: `SELECT team AS team, ROUND(SUM(age) / COUNT(id), 2) AS 'average age' from players GROUP BY team ORDER BY ROUND(SUM(age) / COUNT(id), 2) DESC`,
    combinedMarketValue: 'SELECT team AS team, CONCAT("£",ROUND(SUM(value), 2), "m") AS value FROM players GROUP BY team ORDER by ROUND(SUM(value), 2) DESC',
    homeGrownPlayers: `SELECT team AS team, COUNT(team) AS "homegrown players" FROM (SELECT firstName, team FROM players INNER JOIN teams ON teams.nation = players.nation && teams.id = players.teamId) AS homegrown GROUP BY team ORDER BY COUNT(team) DESC`,
    mostDefenders: `SELECT team AS team, COUNT(position) AS defenders FROM players WHERE position = 'DF' GROUP BY team ORDER BY defenders DESC`,
    mostForwards: `SELECT team AS team, COUNT(position) AS forwards FROM players WHERE position = 'FW' GROUP BY team ORDER BY forwards DESC`
  }
  const joinQueries = {
    teamAge: 'SELECT teamName AS team, SUM(age) AS "combined age" FROM players JOIN teams ON players.teamId = teams.id GROUP BY team ORDER by SUM(age) DESC',
    averageAge: `SELECT teamName AS team, ROUND(SUM(age) / COUNT(teamName), 2) AS 'average age' from players JOIN teams ON players.teamId = teams.id GROUP BY team ORDER BY ROUND(SUM(age) / COUNT(teamName), 2) DESC`,
    combinedMarketValue: 'SELECT teamName AS team, CONCAT("£",ROUND(SUM(value), 2), "m") AS value FROM players JOIN teams ON players.teamId = teams.id  GROUP BY team ORDER by ROUND(SUM(value), 2) DESC',
    homeGrownPlayers: `SELECT teamName AS team, COUNT(teamName) AS "homegrown players" FROM (SELECT firstName, teamName, country FROM players JOIN teams ON players.teamId = teams.id JOIN leagues ON teams.leagueId = leagues.id WHERE players.nation = leagues.country) AS homegrown GROUP BY teamName ORDER BY COUNT(teamName) DESC`,
    mostDefenders: `SELECT teamName AS team, COUNT(position) AS defenders FROM players JOIN teams ON players.teamId = teams.id  WHERE position = 'DF' GROUP BY team ORDER BY defenders DESC`,
    mostForwards: `SELECT teamName AS team, COUNT(position) AS forwards FROM players JOIN teams ON players.teamId = teams.id WHERE position = 'FW' GROUP BY team ORDER BY forwards DESC`
  }
  //choose above query object depending on what database you are using
  const sql = joinQueries[req.body.stat]
  db.query(sql, (err, result) => { 
    if (err) throw err;
    console.log(result);
    res.send(result)
  })
}