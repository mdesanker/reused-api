import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";
import seedDB from "./seed";

// GLOBAL VARIABLES
let janeToken: string;

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
});

afterAll(() => {
  mongoose.connection.close();
});

// GET ROUTES
describe("GET /category/all", () => {
  it("return array of all categories", async () => {
    const res = await request(app).get("/category/all");

    expect(res.statusCode).toEqual(200);
  });
});
