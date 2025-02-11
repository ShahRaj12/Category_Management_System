const request = require("supertest");
const http = require("http");
const app = require("../../app"); // Import app
const server = http.createServer(app);
const mongoose = require("mongoose");

describe("Auth Controller", () => {
  let testServer;

  beforeAll(() => {
    testServer = server.listen(0); // Listen on a random available port
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    testServer.close();
  });

  test("should register a new user", async () => {
    const res = await request(testServer).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
  });

  test("should not register with duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  test("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("should reject invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
