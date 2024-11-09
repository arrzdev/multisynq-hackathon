const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { SignJWT } = require('jose');

require('dotenv').config();

//load env variables
const { MONGODB_URI, JWT_SECRET_KEY } = process.env;
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

//define app
const app = express();
app.use(express.json());
app.use(cors());

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//connect to mongo
mongoose.connect(MONGODB_URI);

//define auth schema
const authSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Auth = mongoose.model('Auth', authSchema);

//routes
app.get("/", cors(), (req, res) => {
  res.json({
    message: "SYNQ CITY AUTH API 🚀"
  });
})

// SIGN-IN ENDPOINT
app.post("/signin", cors(corsOptions), async (req, res) => {
  const body = req.body;
  if (!body || !body.username || !body.password) {
    return res.status(400).json({
      message: "Invalid body"
    });
  }

  //find the user on the database
  const user = await Auth.findOne({ username: body.username });

  if (!user || !bcrypt.compareSync(body.password, user.password)) {
    return res.status(400).json({
      message: "Credentials for login are incorrect"
    });
  }

  //generate the JWT token that will be sent to the client
  const tokenData = {
    username: user.username,
    id: user._id
  }

  const jwtToken = await new SignJWT(tokenData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 days") //1 hour
    .sign(JWT_SECRET);

  res.json({
    message: "User logged in",
    token: jwtToken
  });
})

// SIGN-UP ENDPOINT
app.post("/signup", cors(corsOptions), async (req, res) => {
  const body = req.body;
  if (!body || !body.username || !body.password) {
    return res.status(400).json({
      message: "Invalid body"
    });
  }

  //check if username already exists
  const existingUser = await Auth.findOne({ username: body.username });
  if (existingUser) {
    return res.status(400).json({
      message: "Username already exists"
    });
  }

  //hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.password, salt);

  //create new user entry on the database
  const newUser = await new Auth({
    username: body.username,
    password: hashedPassword,
  }).save();

  //generate the JWT token that will be sent to the client
  const tokenData = {
    username: body.username,
    id: newUser._id
  }

  const jwtToken = await new SignJWT(tokenData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30 days") //1 hour
    .sign(JWT_SECRET);

  res.json({
    message: "User created",
    token: jwtToken
  });
})

//run api
app.listen(3000, () => console.log("\nSYNQ CITY AUTH API 🚀"));
module.exports = app;