const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

if(process.env.NODE_ENV === 'test'){
  console.log("in if");
  dotenv.config({ path: ".env.test" });
}else{
  console.log("in else");
  dotenv.config();
}

connectDB();
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
