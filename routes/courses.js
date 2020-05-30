const express = require("express");
const {
  getCourses , getCourse ,addCourse,updateCourse,deleteCourse
} = require("../controllers/courses");
const {protect} = require('../middleware/auth')
const router = express.Router({mergeParams:true});
router.route('/').get(getCourses)
router.route('/:id').get(getCourse).put(protect,updateCourse).delete(protect,deleteCourse)
router.route('/').post(protect,addCourse)
module.exports = router