const express = require('express');
const { registeredCourseController } = require('../controllers');
const { auth } = require('../middlewares/auth.mdw');
const router = express.Router();

router.post('/register', auth, registeredCourseController.registerCourse);
//Get registered student of course => return list student
router.get('/registered-students/:id', auth, registeredCourseController.getRegisteredStudents); 
router.get('/:id', auth, registeredCourseController.getRegisteredStudents);
router.post('/unregister', auth, registeredCourseController.unregisterCourse);
//Get registered course of student => return list course
router.get('/registered-courses/:id', auth, registeredCourseController.getRegisteredCourses); 


module.exports = router;