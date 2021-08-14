const express = require('express');
const { chapterController } = require('../controllers');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();

router.post('/', chapterController.createChapter);
router.get('/:id', chapterController.getChapterById);
router.get('/', chapterController.getChapters);
router.patch('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);
module.exports = router;