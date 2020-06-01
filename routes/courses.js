const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.route("/").get(getCourses);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);
router.route("/").post(protect, authorize("publisher", "admin"), addCourse);
module.exports = router;
