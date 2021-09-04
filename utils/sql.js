const db = require('./database');

const name = `CONCAT(firstName, ' ', lastName) AS name`;
const names = `firstName, lastName`;
const playerSelection = 'teamName, position, age, nation, squadNumber, value';
const teamSelection = 'position, age, nation, squadNumber, value';
const joinTeams = `INNER JOIN teams ON players.teamId = teams.id`;

function createQuery(selected) {
  let queryString = ''
  for (let i = 0; i < selected.length; i++) {
    if (i === 0) {
      queryString += `SELECT ${name}, ${playerSelection} FROM players ${joinTeams} WHERE ${selected[i].field} = '${selected[i].value}'`
    } else {
      queryString += ` AND ${selected[i].field} = '${selected[i].value}'`
    }
  }
  return queryString
}

function createTeamQuery(selected) {
  let queryString = ''
  for (let i = 0; i < selected.length; i++) {
    if (i === 0) {
      queryString += `SELECT ${name}, ${teamSelection} FROM players ${joinTeams} WHERE ${selected[i].field} = '${selected[i].value}'`
    } else {
      queryString += ` AND ${selected[i].field} = '${selected[i].value}'`
    }
  }
  return queryString
}

exports.getData = (id) => {
  if (id === '') {
    return `SELECT ${name}, ${playerSelection} FROM players ${joinTeams}`
  } else {
    return `SELECT ${name}, ${teamSelection} FROM players ${joinTeams} WHERE teamId = ${id}`
  }
};

exports.filter = (selected, id) => {
  if (id === '') {
    const queryString = createQuery(selected);
    return `${queryString}`
  } else {
    const queryString = createTeamQuery(selected);
    return `${queryString} AND teamId = ${id}`
  }
};

exports.sort = (field, id, direction) => {
  if (id === '') {
    return `SELECT ${name}, ${playerSelection} FROM players ${joinTeams} ORDER BY ${field} ${direction}`;
  } else {
    return `SELECT ${name}, ${teamSelection} FROM players ${joinTeams} WHERE teamId = ${id} ORDER BY ${field} ${direction}`;
  }
};

exports.sortFiltered = (selected, fieldToOrderBy, id, direction) => {
  if (id === '') {
    const queryString = createQuery(selected);
    return direction ? 
    `${queryString} ORDER BY ${fieldToOrderBy} ASC`:
    `${queryString} ORDER BY ${fieldToOrderBy} DESC`
  } else {
    const queryString = createTeamQuery(selected);
    return direction ? 
    `${queryString} AND teamId = ${id} ORDER BY ${fieldToOrderBy} ASC`:
    `${queryString} AND teamId = ${id} ORDER BY ${fieldToOrderBy} DESC`
  }
};

exports.query = (query, res) => db.query(query, (err, result) => { 
  if (err) throw err;
  //console.log({result, query})
  // console.log(query)
  res.send(result);
});