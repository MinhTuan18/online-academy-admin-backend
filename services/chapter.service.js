const { Chapter, Course } = require('../models');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const createChapter = async (chapter) => {
  const courseId = chapter.course;
  const course = Course.findById(courseId);
  if (!course) {
    throw new ApiError('Course is not exist', httpStatus.BAD_REQUEST);
  }
  return await Chapter.create(chapter);
}

const getChapterById = async (chapterId) => {
  return await Chapter.findById(chapterId);
}

const getChapters = async (filters) => {
  const chapters = Chapter.find(filters).sort({'index': 1});
  return chapters;
}

const updateChapter = async (id, chapter) => {
  return await Chapter.findByIdAndUpdate({_id: id}, chapter, {new: true});
}

const deleteChapter = async (id) => {
  return await Chapter.findByIdAndDelete(id);
}
module.exports = {
  createChapter,
  getChapterById,
  getChapters,
  updateChapter,
  deleteChapter
}