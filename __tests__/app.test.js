const request = require("supertest");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Unknown endpoints", () => {
  it("returns 404 endpoint not found", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Endpoint not found. Make a request to /api to see a list of available endpoints"
        );
      });
  });
});

describe("GET /api/categories", () => {
  it("should return status 200, showing all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("should return status 200, showing the review requested if it exists", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T00:00:00.000Z",
          votes: 1,
        });
      });
  });
  it("returns a 400 bad request when review_id is not of the correct type", () => {
    return request(app)
      .get("/api/reviews/notAReview")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("returns 404 not found when number for review_id is too large", () => {
    return request(app)
      .get("/api/reviews/1007")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
});
