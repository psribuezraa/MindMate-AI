const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect to Database
connectDB();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MindMate AI Backend API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
