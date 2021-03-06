const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
var cors = require("cors");
const User = require("./models/userModel");
const routes = require("./routes/route.js");
require("dotenv").config({
  path: path.join(__dirname, "../.env")
});

const app = express();

app.use(cors());

const PORT = process.env.PORT || 7000;
let MONGO_URL =
  process.env.NODE_ENV === "PROD"
    ? process.env.MONGO_URL_PROD
    : process.env.MONGO_URL_TEST;

console.log("connect to ", MONGO_URL);
mongoose.connect(MONGO_URL, { useNewUrlParser: true }).then(() => {
  console.log("Connected to the Database successfully");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    try {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET
      );
      // If token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one"
        });
      }
      res.locals.loggedInUser = await User.findById(userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

app.use("/", routes);

app.get("/test", function(req, res) {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is listening on Port:", PORT);
});

module.exports = app;
