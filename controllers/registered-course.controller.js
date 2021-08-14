const { courseService, registeredCourseService, tokenService} = require('../services');
const httpStatus = require('http-status');

const registerCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(httpStatus.BAD_REQUEST).json('CourseId is required');
    }
    const accessToken = req.headers['x-access-token'];
    const user = await tokenService.verifyToken(accessToken);
    const userId = user._id;
    const result = await registeredCourseService.registerCourse(userId, courseId);
    if (!result) {
      return res.status(500).json('Cannot register course. Please try again later');
    }
    res.status(200).json('Register course successfully');
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const unregisterCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(httpStatus.BAD_REQUEST).json('CourseId is required');
    }
    const accessToken = req.headers['x-access-token'];
    const user = await tokenService.verifyToken(accessToken);
    const userId = user._id;
    const result = await registeredCourseService.unregisterCourse(userId, courseId);
    if (!result) {
      return res.status(500).json('Cannot unregister course. Please try again later');
    }
    res.status(200).json('Unregister course successfully');
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getRegisteredStudents = async (req, res) => {
  const courseId = req.params.id;
  try {
    const registeredStudents = await registeredCourseService.getRegisteredStudents(courseId);
    if (!registeredStudents) {
      return res.status(204).json();
    }
    res.status(200).json(registeredStudents);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getRegisteredCourses = async (req, res) => {
  const userId = req.params.id;
  try {
    const registeredStudents = await registeredCourseService.getRegisteredCourses(userId);
    if (!registeredStudents) {
      return res.status(204).json();
    }
    res.status(200).json(registeredStudents);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

module.exports = {
  registerCourse,
  getRegisteredStudents,
  unregisterCourse,
  getRegisteredCourses
}