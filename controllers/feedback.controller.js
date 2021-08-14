const { feedbackService } = require('../services');
const httpStatus = require('http-status');

const createFeedback = async (req, res) => {
  const { userId, courseId, rating, ratingContent } = req.body;
  try {
    const newFeedback = await feedbackService.createFeedBack(userId, courseId, rating, ratingContent);
    feedbackService.updateCourseRating(updatedFeedback.courseId);
    return res.status(httpStatus.CREATED).json(newFeedback);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const queryFeedback = async (req, res) => {
  try {
    const courseId = req.query.courseId || '';
    const userId = req.query.userId || '';
    const sortBy = req.query.sortBy || '';
    let filter = {};
    let options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1
    }
    if (courseId !== '') filter.courseId = courseId;
    if (userId !== '') filter.userId = userId;
    if (sortBy !== '') options.sort = {sortBy: 1};
    const feedbacks = await feedbackService.queryFeedBack(filter, options);
    if (feedbacks.docs.length === 0) {
        return res.status(httpStatus.NO_CONTENT).json({ message: 'Feedback Not Found'});
    }
    return res.status(httpStatus.OK).json(feedbacks);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const updateFeedback = async (req, res) => {
  try {
    const updatedFeedback = await feedbackService.updateFeedBack(req.params.id, req.body);
    if (!updatedFeedback) {
        return res.status(httpStatus.NO_CONTENT).json('Feedback not found');
    }
    //If update rating, update course average rating
    if (req.body.rating) {
      feedbackService.updateCourseRating(updatedFeedback.courseId);
    }
    res.status(httpStatus.OK).json({
        message: 'Sucessfully updated feedback',
        data: updatedFeedback
    })
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getFeedbackById = async (req, res) => {
  const id = req.params.id;
  try {
    const feedback = await feedbackService.getFeedbackById(id);
    if (!feedback) {
      return res.status(httpStatus.NO_CONTENT).json('Feedback not found');
    }
    res.status(httpStatus.OK).json(feedback);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const deleteFeedback = async (req, res) => {
  const id = req.params.id;
  try {
    const feedback = await feedbackService.deleteFeedBack(id);
    if(!feedback) {
      return res.status(httpStatus.NO_CONTENT).json('Feedback not found');
    }
    //Delete success, calculate course rating and return result;
    feedbackService.updateCourseRating(feedback.courseId);
    res.status(httpStatus.OK).json('Delelte feedback successfully');
  } catch(error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

module.exports = {
  createFeedback,
  queryFeedback,
  updateFeedback,
  getFeedbackById,
  deleteFeedback,
}