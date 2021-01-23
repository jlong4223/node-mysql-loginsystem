// express
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

// importing and running mysql
const mysql = require("mysql");
const db = mysql.createConnection({
  // host is localhost or IP address if using server
  host: process.env.HOST,
  user: "root",
  password: "root",
  database: process.env.DATABASE,
});

// dirname is the file you are in, we are joining this directory with the public using path - then have express use it
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// middleware
app.set("view engine", "hbs");

// connecting to the database
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL Connected...");
  }
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// Running the server
const port = process.env.PORT || 3306;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
