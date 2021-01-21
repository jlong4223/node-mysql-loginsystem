// express
const express = require("express");
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
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL Connected...");
  }
});

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Home Page</h1>");
});

const port = process.env.PORT || 3306;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
