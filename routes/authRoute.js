const { signUp } = require("../controller/authController");

const router = require("express").Router();

router.route("/signup").post(signUp);

module.exports = router;
