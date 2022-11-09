const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 12;
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/main", isLoggedIn, (req, res) => {
  res.render("auth/main");
});

router.get("/main", isLoggedOut, (req, res) => {
  res.render("/main");
});

router.get("/private", isLoggedIn, (req, res) => {
  res.render("auth/private", { currentUser: req.session.currentUser });
});

router.get("/private", isLoggedOut, (req, res) => {
  res.render("/private");
});

router.get("/profils", isLoggedOut, (req, res) => {
  console.log("not logged");
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.render("auth/signup", {
        errorMessage: "Both fields are mandatory",
      });
    }

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.render("auth/signup", {
        errorMessage: "Username is already taken",
      });
    }

    const generatedSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, generatedSalt);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.render("auth/login", {
        errorMessage: "Both fields are mandatory",
      });
    }

    const registeredUser = await User.findOne({ username });
    if (!registeredUser) {
      return res.render("auth/login", {
        errorMessage: "This account doesn't exist",
      });
    }

    const samePassword = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (!samePassword) {
      return res.render("auth/login", {
        errorMessage: "Wrong password",
      });
    }
    req.session.currentUser = registeredUser;
    console.log("SESSION =====> ", req.session);
    console.log("log in");
    res.redirect("auth/private");
  } catch (error) {
    next(error);
  }
});

// // router.get("/profils", isLoggedIn, (req, res) => {
// //   res.render("auth/signup", { currentUser: req.session.currentUser });
// // });

module.exports = router;
