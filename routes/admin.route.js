const express = require('express');
const { adminController } = require('../controllers');
const { adminAuth } = require('../middlewares/auth.mdw');

const router = express.Router();


router.post('/login', adminController.loginAdmin);


module.exports = router;