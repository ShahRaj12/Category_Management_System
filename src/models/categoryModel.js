const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      require: true,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);
