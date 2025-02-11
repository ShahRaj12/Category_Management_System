const express = require("express");
const {
  createCategoryHandler,
  getCategoriesHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCategoryHandler);
router.get("/", authMiddleware, getCategoriesHandler);
router.put("/:id", authMiddleware, updateCategoryHandler);
router.delete("/:id", authMiddleware, deleteCategoryHandler);

module.exports = router;
