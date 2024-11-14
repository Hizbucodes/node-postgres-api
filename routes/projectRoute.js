const { authentication, restrictTo } = require("../controller/authController");
const {
  createProject,
  getAllProjects,
  getProjectsById,
  updateProject,
  deleteProject,
} = require("../controller/projectController");

const router = require("express").Router();

router
  .route("/")
  .post(authentication, restrictTo("SELLER", "BUYER"), createProject);

router.route("/getAllProjects").get(authentication, getAllProjects);

router.route("/:id").get(authentication, getProjectsById);

router.route("/updateProject/:id").patch(authentication, updateProject);

router.route("/deleteProject/:id").delete(authentication, deleteProject);

module.exports = router;
