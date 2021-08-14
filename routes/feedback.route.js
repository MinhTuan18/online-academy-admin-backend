const express = require('express');
const { feedbackController } = require('../controllers');
const { auth } = require('../middlewares/auth.mdw');
const router = express.Router();

router.post('/', auth, feedbackController.createFeedback);
router.get('/', feedbackController.queryFeedback);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/:id', auth, feedbackController.updateFeedback);
router.delete('/:id', auth, feedbackController.deleteFeedback);
module.exports = router;