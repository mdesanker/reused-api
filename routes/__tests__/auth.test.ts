import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";
import seedDB from "./seed";

// GLOBAL VARIABLES
let userToken;
let adminToken;

// TEST SETUP
beforeAll(async () => {
  await initializeTestServer();
  await seedDB();
});

afterAll(() => {
  mongoose.connection.close();
});

//POST ROUTES
describe("POST /auth/register", () => {
  it("return new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "password",
      userType: "user",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("return error for missing login details", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "noEmail",
      email: "",
      password: "password",
      userType: "user",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Email is required");
  });

  it("return error for password too short", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "user",
      email: "user@gmail.com",
      password: "pass",
      userType: "user",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual(
      "Password must be at least 6 characters long"
    );
  });

  it("return error if email already associated with account", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "test2",
      email: "test@gmail.com",
      password: "password",
      userType: "user",
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Email is already in use");
  });
});

// GET ROUTES
describe("GET /auth", () => {
  it("return 200 status code", async () => {
    const res = await request(app).get("/auth");

    expect(res.statusCode).toEqual(200);
  });
});

//
