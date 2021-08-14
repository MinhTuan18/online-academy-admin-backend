const express = require('express');
const { watchListcontroller } = require('../controllers');
const auth = require('../middlewares/auth.mdw');
const router = express.Router();


module.exports = router;