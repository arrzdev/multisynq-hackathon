const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { SignJWT } = require('jose');

require('dotenv').config();

// Load environment variables
const { MONGODB_URI, JWT_SECRET_KEY } = process.env;
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// Define app
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' })); // Allow any origin

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Define authentication schema
const authSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Auth = mongoose.model('Auth', authSchema);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "SYNQ CITY AUTH API 🚀"
  });
});

// SIGN-IN ENDPOINT
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid body"
    });
  }

  const user = await Auth.findOne({ username });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({
      message: "Credentials for login are incorrect"
    });
  }

  const tokenData = {
    username: user.username,
    id: user._id
  };

  const jwtToken = await new SignJWT(tokenData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 days")
    .sign(JWT_SECRET);

  res.json({
    message: "User logged in",
    token: jwtToken
  });
});

// SIGN-UP ENDPOINT
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid body"
    });
  }

  const existingUser = await Auth.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      message: "Username already exists"
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await new Auth({
    username,
    password: hashedPassword,
  }).save();

  const tokenData = {
    username: newUser.username,
    id: newUser._id
  };

  const jwtToken = await new SignJWT(tokenData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 days")
    .sign(JWT_SECRET);

  res.json({
    message: "User created",
    token: jwtToken
  });
});


// Run API
app.listen(3000, () => console.log("\nSYNQ CITY AUTH/STORAGE API 🚀"));
module.exports = app;