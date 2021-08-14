const httpStatus = require('http-status');
const { chapterService, courseService} = require('../services');

const createChapter = async (req, res) => {
  try {
    const chapter = req.body;

    if(!chapter || !chapter.video || !chapter.course || !chapter.name) {
      return res.status(httpStatus.BAD_REQUEST).json('Missing information');
    }
    const newChapter = await chapterService.createChapter(chapter);
    res.status(httpStatus.CREATED).json({
      message: 'Create chapter succesfully',
      data: newChapter
    })
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getChapterById = async (req, res) => {
  try {
    const chapterId = req.params.id;
    if (!chapterId) {
      return res.status(httpStatus.BAD_REQUEST).json('chapter ID is required');
    }
    const chapter = await chapterService.getChapterById(chapterId);

    if (!chapter) {
      return res.status(httpStatus.NO_CONTENT).json();
    }

    res.status(httpStatus.OK).json(chapter);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const getChapters = async (req, res) => {
  const course  = req.query.course || '';
  const index = req.query.index || '';
  let filter = {};

  if (course !== '') filter.course = course;
  if (index !== '') filter.index = index;
  try {
    const chapters = await chapterService.getChapters(filter);
    if (!chapters || !chapters.length) {
      return res.status(httpStatus.NO_CONTENT).json('No chapters found');
    }
    res.status(httpStatus.OK).json(chapters);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const deleteChapter = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await chapterService.deleteChapter(id);
    if (!result) {
      return res.status(httpStatus.NO_CONTENT).json({message: 'Chapter not found'});
    }
    res.status(httpStatus.OK).json('Delete chapter successfully');
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}

const updateChapter = async (req, res) => {
  try {
    const id = req.params.id;
    const chapter = req.body;

    if (!id || !chapter) {
      return res.status(httpStatus.BAD_REQUEST).json('Missing information');
    }
    
    const updatedChapter = await chapterService.updateChapter(id, chapter);
    
    if (!updatedChapter) {
      return res.status(httpStatus.NO_CONTENT).json({message: 'Chapter not found'});
    }
    res.status(httpStatus.OK).json(updatedChapter);

  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
}
module.exports = {
  createChapter,
  getChapterById,
  getChapters,
  deleteChapter,
  updateChapter
}