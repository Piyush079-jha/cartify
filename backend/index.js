const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require('path');
require("dotenv").config();

const connectDB = require("./config/db");
const router = require("./routes");

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://cartifyy-orpin.vercel.app'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser());

// Serve frontend public folder (for local product images)
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use("/api", router);

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("connect to DB");
    console.log("Server is running " + PORT);
  });
});
