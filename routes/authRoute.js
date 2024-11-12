const { signUp, signIn } = require("../controller/authController");

const router = require("express").Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

module.exports = router;
