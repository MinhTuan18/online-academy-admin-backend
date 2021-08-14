const express = require('express');
const { categoryController } = require('../controllers');
const {auth} = require('../middlewares/auth.mdw');
const router = express.Router();

router
  .route('/')
  .post(auth, categoryController.createCategory);

router.get('/', categoryController.getAllCategory);

router.get('/:id', categoryController.getCategoryById);


router.post('/:id', auth, categoryController.updateCategory);

router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;