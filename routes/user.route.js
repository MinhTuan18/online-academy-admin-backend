const express = require('express');
const { userController } = require('../controllers');
const { adminAuth } = require('../middlewares/auth.mdw');
const router = express.Router();

router.get('/', adminAuth, userController.getAllUsers);

router.post('/', adminAuth, userController.addNewUser);

router.post('/blockUser', adminAuth, userController.blockUser);

router.get('/:id', userController.getUserById);

router.put('/:id', userController.updateProfile);



module.exports = router;
