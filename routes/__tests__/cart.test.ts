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
const cartId: string = "620e1a4b2dc4a3341164625a";
const johnCartId: string = "620e1a4b2dc4a3341164625c";
const invalidCartId: string = "620e1a4b2dc4a33411600000";
const electronicsId: string = "620b90e0c2b6e006dde0cb41";
const apparelId: string = "620b90e0c2b6e006dde0cb42";
let invalidId: string = "620b90e0c2b6e006dde00000";

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
describe("GET /cart/all", () => {
  it("return array with all carts", async () => {
    const res = await request(app).get("/cart/all");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /cart/user/:id", () => {
  it("return cart for user id", async () => {
    const res = await request(app).get(`/cart/user/${johnId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user._id).toEqual(johnId);
    expect(res.body).toHaveProperty("products");
  });

  it("return error for invalid user id", async () => {
    const res = await request(app).get(`/cart/user/${invalidId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.errors[0].msg).toEqual("Invalid user id");
  });
});

describe("GET /cart/:id", () => {
  it("return specific cart", async () => {
    const res = await request(app).get(`/cart/${johnCartId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(johnCartId);
    expect(res.body).toHaveProperty("products");
  });

  it("return error for invalid cart id", async () => {
    const res = await request(app).get(`/cart/${invalidCartId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.errors[0].msg).toEqual("Invalid cart id");
  });
});
