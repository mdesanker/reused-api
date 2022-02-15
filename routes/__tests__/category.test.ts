import app from "./app";
import initializeTestServer from "../../config/mongoTestConfig";
import request from "supertest";
import mongoose from "mongoose";
import seedDB from "./seed";

// GLOBAL VARIABLES
let janeToken: string;
let johnToken: string;
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
describe("GET /category/all", () => {
  it("return array of all categories", async () => {
    const res = await request(app).get("/category/all");

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /category/:id", () => {
  it("return category by id", async () => {
    const res = await request(app).get(`/category/${electronicsId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(electronicsId);
    expect(res.body).toHaveProperty("name");
  });

  it("return error for invalid category id", async () => {
    const res = await request(app).get(`/category/${invalidId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid category id");
  });
});

// POST ROUTES
describe("POST /category/add", () => {
  it("return new category", async () => {
    const res = await request(app)
      .post("/category/add")
      .send({
        name: "Tools",
        description: "Get 'er done",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Tools");
    expect(res.body.description).toEqual("Get 'er done");
  });

  it("return error if name missing", async () => {
    const res = await request(app)
      .post("/category/add")
      .send({
        name: "",
        description: "Where did my name go?",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Name is required");
  });

  it("return error if name already used", async () => {
    const res = await request(app)
      .post("/category/add")
      .send({
        name: "Tools",
        description: "And another one...",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Category already exists");
  });

  it("return error if user not admin", async () => {
    const res = await request(app)
      .post("/category/add")
      .send({
        name: "Furniture",
        description: "Furniture description",
      })
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });
});

// PUT ROUTES
describe("PUT /category/:id", () => {
  it("return updated category", async () => {
    const res = await request(app)
      .put(`/category/${apparelId}`)
      .send({
        name: "Clothing",
        description: "Clothes 4 u and clothes 4 me",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(apparelId);
    expect(res.body.name).toEqual("Clothing");
  });

  it("return error if new name taken", async () => {
    const res = await request(app)
      .put(`/category/${apparelId}`)
      .send({
        name: "Electronics",
        description: "And another one...",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Category already exists");
  });

  it("return error if user not admin", async () => {
    const res = await request(app)
      .put(`/category/${apparelId}`)
      .send({
        name: "Sports",
        description: "Sports game things",
      })
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid credentials");
  });

  it("return error if name missing", async () => {
    const res = await request(app)
      .put(`/category/${apparelId}`)
      .send({
        name: "",
        description: "No name brand",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Name is required");
  });

  it("return error for invalid category id", async () => {
    const res = await request(app)
      .put(`/category/${invalidId}`)
      .send({
        name: "Household",
        description: "Kitchenaid mixers and more",
      })
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.errors[0].msg).toEqual("Invalid category id");
  });
});

describe("DELETE /category/:id", () => {
  it("delete category by id", async () => {
    const res = await request(app)
      .delete(`/category/${electronicsId}`)
      .set("x-auth-token", janeToken);

    const check = await request(app)
      .get(`/category/${electronicsId}`)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual("Category deleted");
    expect(check.statusCode).toEqual(404);
    expect(check.body.errors[0].msg).toEqual("Invalid category id");
  });

  it("return error for invalid category id", async () => {
    const res = await request(app)
      .delete(`/category/${invalidId}`)
      .set("x-auth-token", janeToken);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.error[0].msg).toEqual("Invalid category id");
  });

  it("return error for user not admin", async () => {
    const res = await request(app)
      .delete(`/category/${apparelId}`)
      .set("x-auth-token", johnToken);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("errors");
    expect(res.body.error[0].msg).toEqual("Invalid credentials");
  });
});
