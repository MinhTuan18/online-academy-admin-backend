const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/webhook.controller');

router.post('/', webhookController.postWebhook);
router.get('/', webhookController.getWebhook);

module.exports = router;