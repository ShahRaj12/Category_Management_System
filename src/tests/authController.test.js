const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { register, login } = require("../controllers/authController");

describe("Auth Controller", () => {
  let mongoServer;

  beforeAll(async () => {
    // Start MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Insert test user
    const userData = {
      name: "New User",
      email: "test@example.com",
      password: "123456",
    };

    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should register a new user", async () => {
    const userData = {
      name: "New User",
      email: "newuser@example.com",
      password: "password123",
    };

    const req = { body: userData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User registered successfully" })
    );

    // Check if user is in database
    const savedUser = await User.findOne({ email: userData.email });
    expect(savedUser).not.toBeNull();
  });

  test("should login with valid credentials", async () => {
    const req = {
      body: { email: "test@example.com", password: "123456" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Login successfull" })
    );
  });

  test("should not register with duplicate email", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User already exists" })
    );
  });

  test("should reject invalid login", async () => {
    const req = {
      body: { email: "wrong@example.com", password: "wrongpass" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid email or password" })
    );
  });
});
