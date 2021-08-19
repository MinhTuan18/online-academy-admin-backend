const express = require('express');
const { subcategoryController } = require('../controllers');
const {auth} = require('../middlewares/auth.mdw');
const router = express.Router();

router
  .route('/most-registered')
  .get(subcategoryController.getMostRegisterSubCategoriesLast7Days);

router
  .route('/')
  .get(subcategoryController.getSubCategories)
  .post(auth, subcategoryController.createSubCategory);

router
  .route('/:id')
  .get(subcategoryController.getCategoryById)
  .put(auth, subcategoryController.updateCategory)
  .delete(auth, subcategoryController.deleteCategory);



// router.get('/:id', subcategoryController.getCategoryById);

// // router.get('/', subcategoryController.getSubCategories);


// router.post('/:id', auth, subcategoryController.updateCategory);

// router.delete('/:id', auth, subcategoryController.deleteCategory);

module.exports = router;
