const { subcategoryService } = require('../services');

const createSubCategory = async (req, res) => {
  const subCategoryBody  = req.body;
  // // console.log(name);
  // if (!name){
  //   return res.status(400).json("Category name is required!");
  // }
  try {
    const subCategory = await subcategoryService.createSubCategory(subCategoryBody);
    if (!subCategory && !subCategory.id){
      return res.status(500).json("Please try again later");
    }
    res.status(201).json({
      message: "Create sub-category successfully!",
      data: subCategory,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

const getMostRegisterSubCategoriesLast7Days = async (req, res) => {
  // console.log('OK');
  const registeredCourses = await subcategoryService.queryMostRegisteredSubCategoryLast7Days();
  res.status(200).json(registeredCourses);
}

module.exports = {
  createSubCategory,
  getMostRegisterSubCategoriesLast7Days,
  getAllCategory: async function (req, res) {
    const listCategory = await subcategoryService.getCategories();
    return res.status(200).json(listCategory);
  },
  
  getCategoryById: async function (req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json("Category Id is required");
    }
    try {
      const category = await subcategoryService.getSubCategoryById(id);
      if (!category){
        return res.status(204).json();
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  updateCategory: async function (req, res) {
    const id = req.params.id;
    const name= req.body.name;
    if (!id) {
      return res.status(400).json("Category id is required!");
    }
    if (!name) {
      return res.status(400).json("Category name is required!");
    }
    try {
      const category = await subcategoryService.updateSubCategoryById(id, req.body);
      if (!category){
        return res.status(204).json();
      }
      res.status(200).json({
        message: "Update category successfully!",
        data: category,
      });
    }
    catch (error) {
      return res.status(error.statusCode || 500).json(error.message);
    }
  },

  deleteCategory: async function (req, res) {
    const id = req.params.id;
    try {
      const category = await subcategoryService.deleteSubCategoryById(id);
      if (!category) {
        return res.status(204).json();
      }
    return res.status(200).json("Delete category successfully");
    } catch (error) {
      return res.status(error.statusCode || 500).json(error.message);
    }
    
  },

  getSubCategories: async (req, res) => {
    const categoryId  = req.query.catId || '';
    const sortBy = req.query.sortBy || '';
    let filter = {};
    let options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1
    }
    if (categoryId !== '') filter.category = categoryId;
    if (sortBy !== '') options.sort = {sortBy: 1};
    
    const {result, totalResults} = await subcategoryService.getAll(req.query);

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', totalResults);
    return res.status(200).json(result);
  }

}
