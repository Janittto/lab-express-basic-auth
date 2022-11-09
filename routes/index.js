const router = require("express").Router();

router.use("/auth", require("./auth.routes"));

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profils", (req, res, next) => {
  console.log(req.session.currentUser);
  //console.log(currentUser);
  res.render("profils", { currentUser: req.session.currentUser });
});

module.exports = router;
