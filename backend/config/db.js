const mongoose = require("mongoose");

async function connectDB() {
  try {
    // const conn = await mongoose.connect(process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
