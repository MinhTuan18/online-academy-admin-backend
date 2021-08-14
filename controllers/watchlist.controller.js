const { watchListService, tokenService } = require('../services');
const httpStatus = require('http-status');

const addNewCourseToWatchList = async (req, res) => {
  try {
    const accessToken = req.headers['x-access-token'];
    const user = await tokenService.verifyToken(accessToken);
    const userId = user.id;
    const courseId = req.params.id;
    if (!courseId) {
      return res.status(httpStatus.BAD_REQUEST).json('Course Id is required');
    }
    if (!userId) {
      return res.status(httpStatus.UNAUTHORIZED).json('Unauthorized');
    }
    const result = await watchListService.addNewCourseToWatchList(userId, courseId);
    if (!result) {
      return res.status(500).json('Cannot add to watch list now. Please try again later');
    } 
    res.status(httpStatus.CREATED).json('Add to watchlist successfully');
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const deleteCourseFromWatchList = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(httpStatus.BAD_REQUEST).json('Id is required');
    }
    const result = await watchListService.deleteCourseFromWatchList(id);
    if (!result) {
      return res.status(204).json('Not found');
    } 
    res.status(httpStatus.OK).json('Remove successfully');
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getMyWatchList = async (req, res) => {
  const accessToken = req.headers['x-access-token'];
  const user = await tokenService.verifyToken(accessToken);
  const userId = user.id;
  if (!userId) {
    return res.status(httpStatus.UNAUTHORIZED).json('Unauthorized');
  }
  const watchList = await watchListService.getMyWatchList(userId);
  res.status(httpStatus.OK).json(watchList);
}

module.exports = {
  addNewCourseToWatchList,
  deleteCourseFromWatchList,
  getMyWatchList,
}