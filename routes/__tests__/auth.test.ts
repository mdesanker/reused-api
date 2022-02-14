import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";

// GLOBAL VARIABLES
let userToken;
let adminToken;

// TEST SETUP
beforeAll(async () => {
  await initializeTestServer();
});

afterAll(() => {
  mongoose.connection.close();
});

// GET ROUTES
describe("GET /auth", () => {
  it("return 200 status code", async () => {
    const res = await request(app).get("/auth");

    expect(res.statusCode).toEqual(200);
  });
});
