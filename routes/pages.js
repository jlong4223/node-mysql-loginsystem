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
  res.render("profile");
});

module.exports = router;
