const express = require('express');
const { instructorController } = require('../controllers');
const { adminAuth } = require('../middlewares/auth.mdw');
const router = express.Router();

router.get('/', adminAuth, instructorController.getAllUsers);

router.post('/', adminAuth, instructorController.addNewUser);


router.get('/:id', instructorController.getUserById);

router.put('/:id', instructorController.updateProfile);



module.exports = router;
