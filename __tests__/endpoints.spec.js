const request = require("supertest");
const app = require("../app");

describe("endpoint tests", () => {
  const postEndpoints = {
    one: "/api/get-data",
    two: "/api/filter",
    three: "/api/sort",
    four: "/api/sort-filtered",
    five: "/api/get-stats",
  };
  const reqBodies = {
    one: { id: "" },
    two: {
      selected: [{ field: "teamName", value: "Tottenham Hotspur" }],
      id: "",
    },
    three: {
      field: "value",
      id: "",
      direction: true,
    },
    four: {
      selected: [{ field: "teamName", value: "Tottenham Hotspur" }],
      fieldToOrderBy: "value",
      id: "",
      direction: true,
    },
    five: { stat: "teamAge" },
  };
  const getEndpoints = {
    one: "/api/get-leagues",
    two: "/api/get-teams/1",
    three: "/api/get-team/1",
  };

  it.each`
    endPoint              | reqBody
    ${postEndpoints.one}  |  ${reqBodies.one} 
    ${postEndpoints.two}  |  ${reqBodies.two} 
    ${postEndpoints.three}|  ${reqBodies.three}
    ${postEndpoints.four} |  ${reqBodies.four}
    ${postEndpoints.five} |  ${reqBodies.five}
  `("returns a 200 ok response on POST $endPoint request", async ({endPoint, reqBody}) => {
    const response = await request(app).post(endPoint).send(reqBody) 
    expect(response.status).toBe(200);
  });

  it.each`
    endPoint
    ${getEndpoints.one}
    ${getEndpoints.two}
    ${getEndpoints.three}
  `("returns a 200 ok response on GET $endPoint request", async ({endPoint}) => {
    const response = await request(app).get(`${endPoint}`);
    expect(response.status).toBe(200);
  })
});