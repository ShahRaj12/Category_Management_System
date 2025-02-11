const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("in connectDB", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
