const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// using middleware to check if there is a user before allowing to profile page
router.get("/profile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("profile", {
      // this is how to pass info to the hbs file
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
