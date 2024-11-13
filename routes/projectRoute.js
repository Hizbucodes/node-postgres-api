const { authentication } = require("../controller/authController");
const { createProject } = require("../controller/projectController");

const router = require("express").Router();

router.route("/").post(authentication, createProject);

module.exports = router;
