const express = require('express');
const { authController } = require('../controllers');
const { auth } = require('../middlewares/auth.mdw');

const router = express.Router();

router.post('/login', authController.login);

router.post('/register', authController.register);

router.post('/change-password', auth, authController.changePassword);

router.post('/activate-account', authController.activateAccount);

router.post('/resend-otp', authController.resendOTP);

module.exports = router;
