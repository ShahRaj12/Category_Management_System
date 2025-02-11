const request = require("supertest");
const http = require("http");
const app = require("../../app"); // Import app
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

const server = http.createServer(app);

describe("Category Controller", () => {
  let testServer;
  let authToken; // Store JWT token

  beforeAll(async () => {
    testServer = server.listen(0); // Listen on a random available port

    // Register to get a valid token
    await request(testServer).post("/api/auth/register").send({
      name: "Test User",
      email: "test1@example.com",
      password: "123456",
    });

    // Login to get a valid token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "test1@example.com",
      password: "123456",
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");

    authToken = loginRes.body.token; // Save token for later use
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    testServer.close();
  });

  test("should create a category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${authToken}`) // Use token in headers
      .send({
        name: "Electronics",
        parent: null,
        status: "active",
      });

    expect(res.statusCode).toBe(201);
  });

  test("should get category tree", async () => {
    await Category.create({
      name: "Electrical",
      parent: null,
      status: "active",
    });

    const res = await request(app)
      .get("/api/categories")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  test("should update a category", async () => {
    const category = await Category.create({
      name: "Mobiles",
      parent: null,
      status: "active",
    });

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: "Smartphones", status: "inactive" });

    expect(res.statusCode).toBe(200);
    expect(res.body.category.name).toBe("Smartphones");
    expect(res.body.category.status).toBe("inactive");
  });

  test("should delete a category", async () => {
    const category = await Category.create({
      name: "Laptops",
      parent: null,
      status: "active",
    });
    const res = await request(app)
      .delete(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${authToken}`); // Use token in headers

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");
  });
});
