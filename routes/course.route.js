const express = require('express');
const { courseController } = require('../controllers');
const { auth, instructorAuth } = require('../middlewares/auth.mdw');
const router = express.Router();


router
  .route('/')
  .get(courseController.getCourses)
  .post(instructorAuth, courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .put(auth, courseController.updateCourse)
  .delete(auth, courseController.deleteCourse);

module.exports = router;
