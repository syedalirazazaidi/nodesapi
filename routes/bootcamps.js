const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const courseRouter = require("./courses");
const router = express.Router();
const {protect} = require('../middleware/auth')
router.use("/:bootcampId/courses", courseRouter);
// router.route("/").get(getBootcamps);
// router.route("/").post(createBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/:id/photo").put(protect,bootcampPhotoUpload);
router.route("/").get(getBootcamps).post(protect,createBootcamp);

router.route("/:id").get(getBootcamp);
router.route("/:id").put(protect,updateBootcamp);
router.route("/:id").delete(protect,deleteBootcamp);
module.exports = router;
