const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const {
  createCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/categoryController");

dotenv.config();

describe("Category Controller", () => {
  let mongoServer;
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Start MongoMemoryServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user and generate token
    const hashedPassword = await bcrypt.hash("123456", 10);
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });

    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should create a category", async () => {
    const req = {
      user: { id: testUser._id },
      body: { name: "Electronics", parent: null, status: "active" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await createCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Category created successfully",
        category: expect.objectContaining({ name: "Electronics" }),
      })
    );

    // Verify category in DB
    const category = await Category.findOne({ name: "Electronics" });
    expect(category).not.toBeNull();
  });

  test("should get category tree", async () => {
    await Category.create({
      name: "Electrical",
      parent: null,
      status: "active",
    });

    const req = { user: { id: testUser._id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getCategoriesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: expect.any(Array),
      })
    );

    expect(res.json.mock.calls[0][0].categories.length).toBeGreaterThan(0);
  });

  test("should update a category", async () => {
    const category = await Category.create({
      name: "Mobiles",
      parent: null,
      status: "active",
    });

    const req = {
      user: { id: testUser._id },
      params: { id: category._id },
      body: { name: "Smartphones", status: "inactive" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await updateCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        category: expect.objectContaining({ name: "Smartphones", status: "inactive" }),
      })
    );
  });

  test("should delete a category", async () => {
    const category = await Category.create({
      name: "Laptops",
      parent: null,
      status: "active",
    });

    const req = { user: { id: testUser._id }, params: { id: category._id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteCategoryHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Category deleted successfully" })
    );

    // Check if category is removed from DB
    const deletedCategory = await Category.findById(category._id);
    expect(deletedCategory).toBeNull();
  });
});
