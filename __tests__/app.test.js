require("jest-sorted");
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

describe("/api/categories", () => {
  describe("GET", () => {
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
  describe("All other methods", () => {
    it("returns 405 method not allowed error", () => {
      return request(app)
        .post("/api/categories")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed on this endpoint");
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    it("should return status 200, showing the review requested if it exists", () => {
      return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            review: {
              review_id: 3,
              title: "Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "bainesface",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "We couldn't find the werewolf!",
              category: "social deduction",
              created_at: "2021-01-18T00:00:00.000Z",
              votes: 5,
              comment_count: "3",
            },
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
  describe("PATCH", () => {
    it("returns 202 accepted with the new vote count", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 100 })
        .expect(202)
        .then(({ body }) => {
          expect(body).toEqual({
            review: {
              review_id: 3,
              title: "Ultimate Werewolf",
              designer: "Akihisa Okui",
              owner: "bainesface",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "We couldn't find the werewolf!",
              category: "social deduction",
              created_at: "2021-01-18T00:00:00.000Z",
              votes: 105,
            },
          });
        });
    });
    it("returns 400 bad request when review_id is not a number", () => {
      return request(app)
        .patch("/api/reviews/notAReview")
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 not found when number for review_id is too large", () => {
      return request(app)
        .patch("/api/reviews/1007")
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review not found");
        });
    });
    it("returns 400 bad request when body does not have an inc_votes property", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ wrongKey: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Request only accepts JSON with 'inc_votes' property"
          );
        });
    });
    it("returns 400 bad request when inc_votes property is not a number/invalid", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "nope" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 422 unprocessable entity when additional props are listed in the body", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: 100, something: "else" })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).toBe("Unprocessable entity found in request body");
        });
    });
  });
  describe("All other methods", () => {
    it("returns 405 method not allowed error", () => {
      return request(app)
        .post("/api/reviews/3")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed on this endpoint");
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("GET", () => {
    it("returns 200 with all reviews when no queries are given, default sorted by date created", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)).toEqual(["reviews"]);
          expect(body.reviews).toHaveLength(13);
          body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
          expect(body.reviews).toBeSortedBy("created_at", {
            coerce: true,
          });
        });
    });
    describe("Param: sort_by", () => {
      it("sorts the response in descending order against the given column", () => {
        return request(app)
          .get("/api/reviews?sort_by=category")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("category", { descending: true });
          });
      });
      it("returns 400 bad request when the sort_by param is not in the reviews table columns", () => {
        return request(app)
          .get("/api/reviews?sort_by=badCol")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query");
          });
      });
    });
    describe("Param: order", () => {
      it("correctly orders ascending", () => {
        return request(app)
          .get("/api/reviews?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("created_at", {
              descending: false,
            });
          });
      });
      it("correctly orders descending", () => {
        return request(app)
          .get("/api/reviews?sort_by=review_id&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("review_id", {
              descending: true,
            });
          });
      });
      it("returns 400 bad request when order param is not valid", () => {
        return request(app)
          .get("/api/reviews?order=bad")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      });
    });
    describe("Param: category", () => {
      it("returns 200 with a table filtered to the given category", () => {
        return request(app)
          .get("/api/reviews?category=social%20deduction")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toHaveLength(11);
            expect(
              body.reviews.every(
                (review) => review.category === "social deduction"
              )
            ).toBe(true);
          });
      });
      it("returns 400 bad request when category to filter does not exist", () => {
        return request(app)
          .get("/api/reviews?category=bad")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid category query");
          });
      });
      it("returns 404 not found when category has no values in reviews table", () => {
        return request(app)
          .get("/api/reviews?category=children%27s%20games")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No reviews found");
          });
      });
    });
  });
  describe("All other methods", () => {
    it("returns 405 method not allowed error", () => {
      return request(app)
        .post("/api/reviews")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed on this endpoint");
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    it("returns 200 with the comment details", () => {
      return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.hasOwnProperty("comments")).toBe(true);
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    it("returns a 400 bad request when review_id is not of the correct type", () => {
      return request(app)
        .get("/api/reviews/notAReview/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 not found when number for review_id is too large", () => {
      return request(app)
        .get("/api/reviews/1007/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review not found");
        });
    });
    it("returns 404 not found when the review has no comments", () => {
      return request(app)
        .get("/api/reviews/13/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comments available");
        });
    });
  });
  describe("POST", () => {
    it("returns 201 created when a new comment is sent", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: "This is a new review",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject({
            comment: {
              comment_id: 7,
              votes: 0,
              created_at: expect.any(String),
              author: "mallionaire",
              body: "This is a new review",
            },
          });
        });
    });
    it("returns a 400 bad request when review_id is not of the correct type", () => {
      return request(app)
        .post("/api/reviews/notAReview/comments")
        .send({
          username: "mallionaire",
          body: "This is a new review",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("returns 404 not found when number for review_id is too large", () => {
      return request(app)
        .post("/api/reviews/1007/comments")
        .send({
          username: "mallionaire",
          body: "This is a new review",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Review not found");
        });
    });
    it("returns 400 bad request when body does not have both username and body properties", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ wrongKey: 100 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Request only accepts JSON with 'username' and 'body' properties"
          );
        });
    });
    it("returns 404 not found when username does not exist", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({
          username: "nope",
          body: "Random comment",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "User not found. Please add the user before commenting"
          );
        });
    });
    it("returns 422 unprocessable entity when additional props are listed in the body", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({
          username: "mallionaire",
          body: "Review",
          something: "else",
        })
        .expect(422)
        .then(({ body }) => {
          expect(body.msg).toBe("Unprocessable entity found in request body");
        });
    });
  });
  describe("All other methods", () => {
    it("returns 405 method not allowed error", () => {
      return request(app)
        .put("/api/reviews/1/comments")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed on this endpoint");
        });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    it("returns 200 with a list of endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toMatchObject({
            endpoints: {
              "/api/categories": {
                GET: expect.any(String),
              },
              "/api/reviews": {
                GET: expect.any(String),
              },
              "/api/reviews/:review_id": {
                GET: expect.any(String),
                PATCH: expect.any(String),
              },
              "/api/reviews/:review_id/comments": {
                GET: expect.any(String),
                POST: expect.any(String),
              },
            },
          });
        });
    });
  });
  describe("All other methods", () => {
    it("returns 405 method not allowed error", () => {
      return request(app)
        .put("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method not allowed on this endpoint");
        });
    });
  });
});
