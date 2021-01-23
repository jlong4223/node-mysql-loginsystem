// express and modules
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");

// imports routes
const pagesRouter = require("./routes/pages");
const authRouter = require("./routes/auth");

// getting the .env file
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

// middleware
app.set("view engine", "hbs");
// dirname is the file you are in, we are joining this directory with the public using path - then have express use it
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
// parse so we can grab data from forms
app.use(express.urlencoded({ extended: false }));
// allows us to log the data as json
app.use(express.json());

// connecting to the database
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MYSQL Connected...");
  }
});

// Routes being used
app.use("/", pagesRouter);
app.use("/auth", authRouter);

// Running the server
const port = process.env.PORT || 3306;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
