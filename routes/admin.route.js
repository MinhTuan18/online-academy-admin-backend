const express = require('express');
const { adminController } = require('../controllers');
const { adminAuth } = require('../middlewares/auth.mdw');

const router = express.Router();

router.get('/getAllUsers', adminAuth, adminController.getAllUsers);

router.post('/addNewUser', adminAuth, adminController.addNewUser);

router.post('/blockUser', adminAuth, adminController.blockUser);

router.get('/getUserById/:id', adminController.getUserById);

router.post('/login', adminController.loginAdmin);


module.exports = router;