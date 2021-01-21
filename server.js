// express
const express = require("express");

// importing mysql
const mysql = require("mysql");
const db = mysql.createConnection({
  // host is localhost or IP address if using server
  host: "localhost",
  user: "root",
  password: "root",
  database: "nodejs-login",
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
