const request = require("supertest");
const app = require("../app");
const db = require("../utils/database");

describe("returning results", () => {
  it("returns get-data fields", async () => {
    const response = await request(app).post("/api/get-data").send({ id: "" });
    const fields = response.body[0];
    expect(Object.keys(fields)).toEqual([
      "name",
      "teamName",
      "position",
      "age",
      "nation",
      "squadNumber",
      "value",
    ]);
  });

  it("returns the correct filtered table", async () => {
    const response = await request(app)
      .post("/api/filter")
      .send({
        selected: [{ field: "teamName", value: "Tottenham Hotspur" }],
        id: "",
      });
    const filteredValue = "Tottenham Hotspur";
    const objectArray = response.body;
    const objectsContainingOtherTeamNames = objectArray.filter(
      (obj) => obj.teamName !== filteredValue
    );
    expect(objectsContainingOtherTeamNames.length).toBe(0);
    expect(objectArray.length).toBeGreaterThan(0);
  });

  it("returns an ordered table ascending", async () => {
    const response = await request(app).post("/api/sort").send({
      field: "value",
      id: "",
      direction: true,
    });
    const objectArray = response.body;
    const copiedArray = [...objectArray];
    copiedArray.sort((a, b) => a.value - b.value);
    expect(objectArray).toEqual(copiedArray);
  });

  it("returns an ordered table descending", async () => {
    const response = await request(app).post("/api/sort").send({
      field: "value",
      id: "",
      direction: false,
    });
    const objectArray = response.body;
    const copiedArray = [...objectArray];
    copiedArray.sort((a, b) => b.value - a.value);
    expect(objectArray).toEqual(copiedArray);
  });

  it("returns a filtered and ordered table ascending", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [{ field: "teamName", value: "Tottenham Hotspur" }],
        fieldToOrderBy: "value",
        id: "",
        direction: true,
      });
    const filteredValue = "Tottenham Hotspur";
    const objectArray = response.body;
    const objectsContainingOtherTeamNames = objectArray.filter(
      (obj) => obj.teamName !== filteredValue
    );
    expect(objectsContainingOtherTeamNames.length).toBe(0);
    expect(objectArray.length).toBeGreaterThan(0);

    const copiedArray = [...objectArray];
    copiedArray.sort((a, b) => a.value - b.value);
    expect(objectArray).toEqual(copiedArray);
  });

  it("returns a filtered and ordered table descending", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [{ field: "teamName", value: "Tottenham Hotspur" }],
        fieldToOrderBy: "value",
        id: "",
        direction: false,
      });
    const filteredValue = "Tottenham Hotspur";
    const objectArray = response.body;
    const objectsContainingOtherTeamNames = objectArray.filter(
      (obj) => obj.teamName !== filteredValue
    );
    expect(objectsContainingOtherTeamNames.length).toBe(0);
    expect(objectArray.length).toBeGreaterThan(0);

    const copiedArray = [...objectArray];
    copiedArray.sort((a, b) => b.value - a.value);
    expect(objectArray).toEqual(copiedArray);
  });

  it("returns an object based on multiple filters", async () => {
    const response = await request(app)
      .post("/api/filter")
      .send({
        selected: [
          { field: "teamName", value: "Tottenham Hotspur" },
          { field: "nation", value: "South Korea" },
        ],
        id: "",
      });
    const target = "Son Heung-min";
    const object = response.body[0];
    expect(object.name).toBe(target);
  });

  it("returns an ordered table based on multiple filters", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [
          { field: "teamName", value: "Tottenham Hotspur" },
          { field: "position", value: "DF" },
        ],
        fieldToOrderBy: "value",
        id: "",
        direction: true,
      });
    const filteredTeam = "Tottenham Hotspur";
    const filteredPosition = "DF";
    const objectArray = response.body;
    const objectsContainingOtherValues = objectArray.filter(
      (obj) =>
        obj.teamName !== filteredTeam || obj.position !== filteredPosition
    );
    expect(objectsContainingOtherValues.length).toBe(0);
    expect(objectArray.length).toBeGreaterThan(0);

    const copiedArray = [...objectArray];
    copiedArray.sort((a, b) => a.value - b.value);
    expect(objectArray).toEqual(copiedArray);
  });
});

describe("returning results specified by team id", () => {
  it("returns get-data fields specified by team id", async () => {
    const response = await request(app).post("/api/get-data").send({ id: 1 });
    const fields = response.body[0];
    expect(Object.keys(fields)).toEqual([
      "name",
      "position",
      "age",
      "nation",
      "squadNumber",
      "value",
    ]);
  });

  it("returns the correct filtered table specified by team id", async () => {
    const response = await request(app)
      .post("/api/filter")
      .send({
        selected: [{ field: "position", value: "DF" }],
        id: "1",
      });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE position = 'DF' AND teamId = 1";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
    });
  });

  it("returns an ordered table ascending specified by team id", async () => {
    const response = await request(app).post("/api/sort").send({
      field: "value",
      id: "1",
      direction: true,
    });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE teamId = 1 ORDER BY value ASC";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
      const objectArray = response.body;
      const copiedArray = [...objectArray];
      copiedArray.sort((a, b) => a.value - b.value);
      expect(objectArray).toEqual(copiedArray);
    });
  });

  it("returns an ordered table descending specified by team id", async () => {
    const response = await request(app).post("/api/sort").send({
      field: "value",
      id: "1",
      direction: false,
    });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE teamId = 1 ORDER BY value DESC";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
      const objectArray = response.body;
      const copiedArray = [...objectArray];
      copiedArray.sort((a, b) => b.value - a.value);
      expect(objectArray).toEqual(copiedArray);
    });
  });

  it("returns a filtered and ordered table ascending specified by id", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [{ field: "position", value: "DF" }],
        fieldToOrderBy: "value",
        id: 1,
        direction: true,
      });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE position = 'DF' AND teamId = 1 ORDER BY value ASC";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
      const objectArray = response.body;
      const copiedArray = [...objectArray];
      copiedArray.sort((a, b) => a.value - b.value);
      expect(objectArray).toEqual(copiedArray);
    });
  });

  it("returns a filtered and ordered table descending specified by id", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [{ field: "position", value: "DF" }],
        fieldToOrderBy: "value",
        id: 1,
        direction: false,
      });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE position = 'DF' AND teamId = 1 ORDER BY value DESC";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
      const objectArray = response.body;
      const copiedArray = [...objectArray];
      copiedArray.sort((a, b) => b.value - a.value);
      expect(objectArray).toEqual(copiedArray);
    });
  });

  it("returns an object based on multiple filters specified by id", async () => {
    const response = await request(app)
      .post("/api/filter")
      .send({
        selected: [
          { field: "position", value: "DF" },
          { field: "nation", value: "Portugal" },
        ],
        id: 1,
      });
    const target = "Cedric Soares";
    const object = response.body[0];
    expect(object.name).toBe(target);
  });

  it("returns an ordered table based on multiple filters specified by id", async () => {
    const response = await request(app)
      .post("/api/sort-filtered")
      .send({
        selected: [
          { field: "position", value: "DF" },
          { field: "nation", value: "Brazil" },
        ],
        fieldToOrderBy: "value",
        id: 1,
        direction: true,
      });
    const sql =
      "SELECT CONCAT(firstName, ' ', lastName) AS name, position, age, nation, squadNumber, value FROM players INNER JOIN teams ON players.teamId = teams.id WHERE position = 'DF' AND nation = 'Brazil' AND teamId = 1 ORDER BY value ASC";
    db.query(sql, (err, result) => {
      expect(result).toEqual(response.body);
      const objectArray = response.body;
      const copiedArray = [...objectArray];
      copiedArray.sort((a, b) => a.value - b.value);
      expect(objectArray).toEqual(copiedArray);
    });
  });
});

describe("stats", () => {
  const sql = {
    teamAge:
      'SELECT teamName AS team, SUM(age) AS "combined age" FROM players JOIN teams ON players.teamId = teams.id GROUP BY team ORDER by SUM(age) DESC',
    averageAge: `SELECT teamName AS team, ROUND(SUM(age) / COUNT(teamName), 2) AS 'average age' from players JOIN teams ON players.teamId = teams.id GROUP BY team ORDER BY ROUND(SUM(age) / COUNT(teamName), 2) DESC`,
    combinedMarketValue:
      'SELECT teamName AS team, CONCAT("£",ROUND(SUM(value), 2), "m") AS value FROM players JOIN teams ON players.teamId = teams.id  GROUP BY team ORDER by ROUND(SUM(value), 2) DESC',
    homeGrownPlayers: `SELECT teamName AS team, COUNT(teamName) AS "homegrown players" FROM (SELECT firstName, teamName, country FROM players JOIN teams ON players.teamId = teams.id JOIN leagues ON teams.leagueId = leagues.id WHERE players.nation = leagues.country) AS homegrown GROUP BY teamName ORDER BY COUNT(teamName) DESC`,
    mostDefenders: `SELECT teamName AS team, COUNT(position) AS defenders FROM players JOIN teams ON players.teamId = teams.id  WHERE position = 'DF' GROUP BY team ORDER BY defenders DESC`,
    mostForwards: `SELECT teamName AS team, COUNT(position) AS forwards FROM players JOIN teams ON players.teamId = teams.id WHERE position = 'FW' GROUP BY team ORDER BY forwards DESC`,
  };
  const stat1 = { stat: "teamAge" };
  const stat2 = { stat: "averageAge" };
  const stat3 = { stat: "combinedMarketValue" };
  const stat4 = { stat: "homeGrownPlayers" };
  const stat5 = { stat: "mostDefenders" };
  const stat6 = { stat: "mostForwards" };
  it.each`
    statLabel     | query                      | stat
    ${"1st stat"} | ${sql.teamAge}             | ${stat1}
    ${"2nd stat"} | ${sql.averageAge}          | ${stat2}
    ${"3rd stat"} | ${sql.combinedMarketValue} | ${stat3}
    ${"4th stat"} | ${sql.homeGrownPlayers}    | ${stat4}
    ${"5th stat"} | ${sql.mostDefenders}       | ${stat5}
    ${"6th stat"} | ${sql.mostForwards}        | ${stat6}
  `("returns $statLabel", async ({ query, stat }) => {
    const response = await request(app).post("/api/get-stats").send(stat);
    db.query(query, (err, result) => {
      expect(result).toEqual(response.body);
    });
  });
});

describe("leagues and teams", () => {
  it("returns all leagues", async () => {
    const response = await request(app).get("/api/get-leagues");
    expect(Object.keys(response.body[0])).toEqual(["id", "name", "country"]);
  });

  it("returns all teams in a league", async () => {
    const leagueId = 1;
    const amountOfTeamsInLeague = 20;
    const response = await request(app).get(`/api/get-teams/${leagueId}`);
    const amountOfTeamsInResBody = response.body.length;
    expect(amountOfTeamsInResBody).toEqual(amountOfTeamsInLeague);
  });

  it("returns a specific team", async () => {
    const arsenalTeamId = 1;
    const response = await request(app).get(`/api/get-team/${arsenalTeamId}`);
    const teamName = response.body[0].teamName;
    expect(teamName).toEqual("Arsenal");
  });
});
