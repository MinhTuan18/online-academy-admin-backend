const httpStatus = require('http-status');
const { WatchList, Course } = require('../models');
const ApiError = require('../utils/ApiError');

const addNewCourseToWatchList = async (userId, courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError('Course is not exist', httpStatus.BAD_REQUEST);
  }

  const watchlist = await WatchList.findOne({ user: userId, course: courseId });

  if (watchlist) {
    throw new ApiError('Watchlist is duplicate', httpStatus.BAD_REQUEST);
  }
  
  return await WatchList.create({user: userId, course: courseId});
}

const deleteCourseFromWatchList = async (id) => {
  return await WatchList.findByIdAndDelete(id);
}

const getMyWatchList = async(userId) => {
  const watchList = await WatchList.find({user: userId}).select('course').populate({ path: 'course'});
  return watchList;
}

module.exports = {
  addNewCourseToWatchList,
  deleteCourseFromWatchList,
  getMyWatchList,
}