// import modules in here
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// connecting to the db
const db = mysql.createConnection({
  // host is localhost or IP address if using server
  host: "localhost",
  user: "root",
  password: "root",
  database: "nodejs-login",
});

exports.register = (req, res) => {
  console.log(req.body);

  // if we go to the register form and check the input names, the below should match those
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   const password = req.body.password;
  //   const passwordConfirm = req.body.passwordConfirm;

  //  the below is same as above- i restructered it
  const { name, email, password, passwordConfirm } = req.body;

  //  the question mark is the value we want to look, which we defined in the array next to it
  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result.length > 0) {
        return res.render("register", {
          message: "that email has been taken",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "passwords do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
    }
  );
};
