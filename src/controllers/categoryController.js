const {
    createCategory,
    getCategoryTree,
    updateCategory,
    deleteCategory
  } = require("../services/categoryServices");
  
  const createCategoryHandler = async (req, res) => {
    try {
      const { name, parent } = req.body;
      const category = await createCategory(name, parent);
      res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
      res.status(500).json({ message: "Failed to create category", error: err.message });
    }
  };
  
  const getCategoriesHandler = async (_req, res) => {
    try {
      const categories = await getCategoryTree();
      res.status(200).json({ message: "Categories retrieved successfully", categories });
    } catch (err) {
      res.status(500).json({ message: "Failed to retrieve categories", error: err.message });
    }
  };
  
  const updateCategoryHandler = async (req, res) => {
    try {
      const { name, status } = req.body;
      const category = await updateCategory(req.params.id, name, status);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category updated successfully", category });
    } catch (err) {
      res.status(500).json({ message: "Failed to update category", error: err.message });
    }
  };
  
  const deleteCategoryHandler = async (req, res) => {
    try {
      const result = await deleteCategory(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete category", error: err.message });
    }
  };
  
  module.exports = {
    createCategoryHandler,
    getCategoriesHandler,
    updateCategoryHandler,
    deleteCategoryHandler
  };
  