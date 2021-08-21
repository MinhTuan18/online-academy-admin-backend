const { categoryService } = require('../services');

const createCategory = async (req, res) => {
  const categoryBody  = req.body;
  // // console.log(name);
  // if (!name){
  //   return res.status(400).json("Category name is required!");
  // }
  try {
    const category = await categoryService.createCategory(categoryBody);
    if (!category && !category.id){
      return res.status(500).json("Please try again later");
    }
    res.status(201).json({
      message: "Create category successfully!",
      data: category,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  createCategory,

  getAllCategory: async function (req, res) {
    const {result, totalResults} = await categoryService.getAll(req.query);
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', totalResults);
    return res.status(200).json(result);
  },
  
  getCategoryById: async function (req, res) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json("Category Id is required");
    }
    try {
      const category = await categoryService.getCategoryById(id);
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
      const category = await categoryService.updateCategoryById(id, name);
      if (!category){
        return res.status(204).json();
      }
      res.status(200).json({
        message: "Update category successfully!",
        data: category,
      });
    }
    catch (error) {
      res.status(500).json(err.message);
    }
  },

  deleteCategory: async function (req, res) {
    const id = req.params.id;
    try {
      const category = await categoryService.deleteCategoryById(id);
      if (!category) {
        return res.status(204).json();
      }
    return res.status(200).json("Delete category successfully");
    } catch (error) {
      return res.status(error.statusCode || 500).json(error.message);
    }
    
  }
}