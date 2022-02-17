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
const johnCartId: string = "620e1a4b2dc4a3341164625c";
const invalidCartId: string = "620e1a4b2dc4a33411600000";
const janeProductId: string = "620c1d93a23cda22fcda0569"; // Electronics product
const johnProductId: string = "620c1d93a23cda22fcda0571"; // Electronics product
const johnSecondProductId: string = "620c1d93a23cda22fcda0572"; // Apparel product
const invalidProductId: string = "620c1d93a23cda22fcd00000";

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
    const res = await request(app).get(`/cart/user/${invalidUserId}`);

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

// POST ROUTES
describe("POST /cart/create", () => {
  it("create new cart for user", async () => {
    const res = await request(app)
      .post("/cart/create")
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(201);
    expect(res.body.user._id).toEqual(janeId);
    expect(res.body.products.length).toEqual(0);
  });

  it("return error if user already has a cart", async () => {
    const res = await request(app)
      .post("/cart/create")
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(405);
    expect(res.body.errors[0].msg).toEqual("User already has a cart");
  });
});

// PUT ROUTES
describe("PUT /cart/update", () => {
  it("return updated cart", async () => {
    const cart = [
      {
        product: johnProductId,
        quantity: 3,
      },
      {
        product: johnSecondProductId,
        quantity: 2,
      },
    ];

    const res = await request(app)
      .put("/cart/update")
      .send(cart)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user._id).toEqual(janeId);
    expect(res.body.products[0].product).toEqual(johnProductId);
  });

  it("return cart with invalid products removed", async () => {
    const cart = [
      {
        product: invalidProductId,
        quantity: 3,
      },
      {
        product: johnSecondProductId,
        quantity: 2,
      },
    ];

    const res = await request(app)
      .put("/cart/update")
      .send(cart)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user._id).toEqual(janeId);
    expect(res.body.products[0].product).toEqual(johnSecondProductId);
  });

  it("empty array to clear cart", async () => {
    const res = await request(app)
      .put("/cart/update")
      .send([])
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.user._id).toEqual(janeId);
    expect(res.body.products).toEqual([]);
  });
});
