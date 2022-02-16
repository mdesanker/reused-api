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
const invalidUserId: string = "620ab20b2dffe3ba60300000";
const productId: string = "620c1d93a23cda22fcda0569";
const invalidProductId: string = "620c1d93a23cda22fcd00000";
const electronicsId: string = "620b90e0c2b6e006dde0cb41";
const invalidCategoryId: string = "620b90e0c2b6e006dde00000";

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
describe("GET /product/all", () => {
  it("return array of all products", async () => {
    const res = await request(app).get("/product/all");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /product/:id", () => {
  it("return product by id", async () => {
    const res = await request(app).get(`/product/${productId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(productId);
    expect(res.body).toHaveProperty("name");
  });

  it("return error for invalid product id", async () => {
    const res = await request(app).get(`/product/${invalidProductId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid product id");
  });
});

describe("GET /product/category/:id", () => {
  it("return all products for category id", async () => {
    const res = await request(app).get(`/product/category/${electronicsId}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category._id).toEqual(electronicsId);
  });

  it("return error for invalid category id", async () => {
    const res = await request(app).get(
      `/product/category/${invalidCategoryId}`
    );

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid category id");
  });
});

describe("GET /product/user/:id", () => {
  it("return products for user id", async () => {
    const res = await request(app).get(`/product/user/${janeId}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].owner._id).toEqual(janeId);
  });

  it("return error for invalid user id", async () => {
    const res = await request(app).get(`/product/user/${invalidUserId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid user id");
  });
});

// POST ROUTES
describe("POST /product/add", () => {
  it("return new post", async () => {
    const res = await request(app)
      .post("/product/add")
      .send({
        name: "Gaming mouse",
        price: "45",
        description: "This mouse doesn't eat cheese",
        condition: "fair",
        category: electronicsId,
        images: ["http://placeimg.com/320/480"],
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(201);
    expect(res.body.owner._id).toEqual(janeId);
    expect(res.body.category._id).toEqual(electronicsId);
    expect(res.body).toHaveProperty("name");
  });

  it("return error for invalid category id", async () => {
    const res = await request(app)
      .post("/product/add")
      .send({
        name: "Mouse pad",
        price: "20",
        description: "A comfortable bed for your mouse",
        condition: "good",
        category: invalidCategoryId,
        images: ["http://placeimg.com/660/480"],
      })
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid category id");
  });

  it("return error for missing field", async () => {
    const res = await request(app)
      .post("/product/add")
      .send({
        name: "",
        price: "20",
        description: "A comfortable bed for your mouse",
        condition: "good",
        category: electronicsId,
        images: ["http://placeimg.com/660/480"],
      })
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Name is required");
  });
});
