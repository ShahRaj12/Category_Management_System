const CategoryModel = require("../models/categoryModel");

const createCategory = async (name, parent = null) => {
  return await CategoryModel.create({ name, parent });
};

const getCategoryTree = async () => {
  const categories = await CategoryModel.find().lean();
  return buildCategoryTree(categories);
};

const buildCategoryTree = (categories, parentId = null) => {
  return categories
    .filter((cat) => String(cat.parent) === String(parentId))
    .map((cat) => ({
      ...cat,
      children: buildCategoryTree(categories, cat._id),
    }));
};

const updateCategory = async (id, name, status) => {
  const category = await CategoryModel.findByIdAndUpdate(
    id,
    { name, status },
    { new: true }
  );

  if (status === "inactive") {
    await CategoryModel.updateMany({ parent: id }, { status: "inactive" });
  }

  return category;
};

const deleteCategory = async (id) => {
  const category = await CategoryModel.findById(id);
  if (!category) throw new Error("Category not found");

  await CategoryModel.updateMany({ parent: id }, { parent: category.parent });
  await CategoryModel.findByIdAndDelete(id);
  return category;
};

module.exports = {
  createCategory,
  getCategoryTree,
  updateCategory,
  deleteCategory,
};
