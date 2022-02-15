import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";
import seedDB from "./seed";

// GLOBAL VARIABLES
let janeToken: string;
let johnToken: string;
const janeId: string = "620ab20b2dffe3ba60353a22";
const johnId: string = "620ab20b2dffe3ba60353a23";
const userId: string = "620ab20b2dffe3ba60353a99";
const invalidUserId: string = "620ab20b2dffe3ba60300000";

// TEST SETUP
beforeAll(async () => {
  await initializeTestServer();
  await seedDB();

  // Generate jane token
  const janeLogin = await request(app).post("/auth/login").send({
    email: "jane@gmail.com",
    password: "password",
  });

  janeToken = janeLogin.body.token;

  // Generate john token
  const johnLogin = await request(app).post("/auth/login").send({
    email: "john@gmail.com",
    password: "password",
  });

  johnToken = johnLogin.body.token;
});

afterAll(() => {
  mongoose.connection.close();
});

// GET ROUTES
describe("GET /user/all", () => {
  it("return list of all users if user admin", async () => {
    const res = await request(app)
      .get("/user/all")
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("return error if user not admin", async () => {
    const res = await request(app)
      .get("/user/all")
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });
});

describe("GET /user/:id", () => {
  it("return user by id for admin", async () => {
    const res = await request(app)
      .get(`/user/${userId}`)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(userId);
    expect(res.body).toHaveProperty("username");
  });

  it("return error if not admin", async () => {
    const res = await request(app)
      .get(`/user/${userId}`)
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });

  it("return error for invalid id", async () => {
    const res = await request(app)
      .get(`/user/${invalidUserId}`)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid user id");
  });
});

describe("GET /user/current/detail", () => {
  it("return details for logged in user", async () => {
    const res = await request(app)
      .get("/user/current/detail")
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(janeId);
  });
});
