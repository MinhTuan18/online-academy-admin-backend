const mongoose = require('mongoose');
const { Feedback, Course } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createFeedBack = async (userId, courseId, rating, ratingContent) => {
  if (!userId || !courseId || !rating || !ratingContent) {
    throw new ApiError('Missing information', httpStatus.BAD_REQUEST);
  }
  const course = Course.findOne({_id: courseId});
  if (!course) {
    throw new ApiError('Course is not exist!', httpStatus.BAD_REQUEST);
  }
  return await Feedback.create({ userId, courseId, rating, ratingContent}); 
}

const updateFeedBack = async (id, updateBody) => {
  const options = {
    new: true,
    omitUndefined: true
  }
  console.log(updateBody)
  return await Feedback.findByIdAndUpdate({_id: id}, updateBody, options);
}

const queryFeedBack = async (filter, options) => {
  const { feedback } = filter;
  if (feedback) {
      filter.feedback = mongoose.Types.ObjectId(category);
  }
  const courses = await Feedback.paginate(filter, options);
  return courses;
}

const getFeedbackById = async (id) => {
  if (!id) {
    throw new ApiError('Feedback Id is required!', httpStatus.BAD_REQUEST);
  }
  return await Feedback.findById(id);
}

const deleteFeedBack = async (feedbackId) => {
  return await Feedback.findByIdAndDelete(feedbackId);
}

const getAverageRatingOfCourse = courseId => {
  const feedbacks = Feedback.find({ courseId: courseId});
  if (!feedbacks) {
    throw new ApiError('Course is not exist', httpStatus.BAD_REQUEST);
  }
  const n_Rating = feedbacks.length;
  const sum_Rating =  feedbacks.reduce((rating, feedback) => {
    return rating += feedback.rating;
  }, 0);

  const average_rating = sum_Rating / n_Rating;
  return average_rating;
}

const updateCourseRating = async (courseId) => {
  const averageRating = getAverageRatingOfCourse(courseId);
  const course = await Course.findByIdAndUpdate({ _id: courseId }, { averageRating: averageRating }, { new: true });
  if (!course) {
    throw new ApiError('Course is not exist', httpStatus.BAD_REQUEST);
  }
  return course;
}

module.exports = {
  createFeedBack,
  updateFeedBack,
  deleteFeedBack,
  queryFeedBack,
  getFeedbackById,
  updateCourseRating,
}