const mongoose = require('mongoose');
const { RegisteredCourse, Course, User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const registerCourse = async (userId, courseId) => {
  const registeredCourse = await RegisteredCourse.findOne({ user: userId, course: courseId});
  if (registeredCourse) {
    throw new ApiError('You have already regist this course', httpStatus.BAD_REQUEST);
  }
  const result = RegisteredCourse.create({student: userId, course: courseId});
  return result;
}

const getRegisteredStudents = async (courseId) => {
  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    throw new ApiError('Course is not exist', httpStatus.BAD_REQUEST);
  }
  let registeredStudents = await RegisteredCourse.find({ course: courseId}).populate({ path: 'user', select: 'name email'});

  return registeredStudents;
}

const unregisterCourse = async (userId, courseId) => {
  const result = RegisteredCourse.findOneAndDelete({user: userId, course: courseId});
  return result;
}

const getRegisteredCourses = async (userId) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError('User is not exist', httpStatus.BAD_REQUEST);
  }
  let registeredCourses = await RegisteredCourse.find({ user: userId}).populate('course').select('-user');

  return registeredCourses;
}
module.exports = {
  registerCourse,
  getRegisteredStudents,
  unregisterCourse,
  getRegisteredCourses
}