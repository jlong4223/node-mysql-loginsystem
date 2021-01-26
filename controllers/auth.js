// import modules in here
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const util = require("util");

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
      //   8 is the salt rounds
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          email: email,
          password: hashedPassword,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            res.render("register", {
              message: "User registered",
            });
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Please provide email and password",
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        console.log(results);
        // there should only be one in the database so im using 0, which is 1
        if (
          !results ||
          //   comparing given password with hashed password
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          const id = results[0].id;
          // set the secret
          const token = jwt.sign({ id }, "secret", {
            expiresIn: "90d",
          });
          console.log("the token is: " + token);
          // putting cookies in the browser - can check dev tools application to see cookie after login
          const cookieOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          //   res.cookie is creating the cookie named jwt(could be anything), as the token value(the actual jwt created) and the expiration date of the cookie)
          res.cookie("jwt", token, cookieOptions);
          res.status(200).redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verifying the token
      // the below will decode the token to get the id of the user logged in based on the cookie name which is jwt
      const decoded = await util.promisify(jwt.verify)(
        req.cookies.jwt,
        "secret"
      );
      console.log(decoded);

      // 2) check if the user is in the db by grabbing the decoded token id and looking in the db
      // the array is called the positional parameters
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.id],
        (error, result) => {
          // check the console to see the user that matched
          console.log(result);
          if (!result) {
            return next();
          }
          //  just grabbing one - the first value in the users
          // i can now use this variable in the route
          req.user = result[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    // next allows the route to do the next thing aka render the page
    next();
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    // only allow http browser to do this
    httpOnly: true,
  });
  res.status(200).redirect("/");
};
