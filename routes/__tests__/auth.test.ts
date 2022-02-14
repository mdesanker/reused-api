import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";
import seedDB from "./seed";

// GLOBAL VARIABLES

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
  it("return token for new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "test",
      email: "test@gmail.com",
      password: "password",
      passwordConfirm: "password",
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
      passwordConfirm: "password",
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
      passwordConfirm: "pass",
      userType: "user",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual(
      "Password must be at least 6 characters long"
    );
  });

  it("return error for password and confirm not match", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "anon",
      email: "anon@gmail.com",
      password: "password",
      passwordConfirm: "password1",
      userType: "user",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual(
      "Password confirmation field must have the same value as the password field"
    );
  });

  it("return error if email already associated with account", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "test2",
      email: "test@gmail.com",
      password: "password",
      passwordConfirm: "password",
      userType: "user",
    });

    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Email is already in use");
  });
});

describe("POST /auth/login", () => {
  it("return token on successful login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "jane@gmail.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("return error for missing parameter", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "jane@gmail.com",
      password: "",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });

  it("return error for invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "janet@gmail.com",
      password: "password",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });
});
