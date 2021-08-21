const mongoose = require('mongoose');
const { Category, SubCategory } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a category
 * @param {Object} categoryInfo
 * @returns {Promise<Category>}
**/
const createCategory = async (categoryInfo) => {
    return await Category.create(categoryInfo);
};

/**
 * Get a category by id
 * @param {ObjectId} catId
 * @returns {Promise<Category>}
**/
const getCategoryById = async (catId) => {
    return await Category.findById(mongoose.Types.ObjectId(catId));
};

/**
 * Get all categories
 * @returns {Promise<Category>}
**/
const getCategories = async () => {
    return await Category.paginate();
};

/**
 * Query for categories
 * @returns {Promise<QueryResult>}
**/
const queryAllCategories = async () => {
    const categories = await Category.aggregate([
        
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategories',
                foreignField: '_id',
                as: 'subCategories',
            },
        },
        {
            $addFields: {
                'subCategories.total': { $size: '$subCategories.courses' },
            },
        },
        {
            $project: {
                'subCategories.category': 0,
            },
        },
        {
            $addFields: {
                total: { $sum: '$subCategories.total' },
            },
        },
    ]);
  
    return categories;
};

/**
 * Update a category by id
 * @param {ObjectId} catId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
**/
const updateCategoryById = async (catId, updateBody) => {
    const options = {
        new: true,
        omitUndefined: true
    }
    return await Category.findByIdAndUpdate(mongoose.Types.ObjectId(catId),{ name: updateBody }, options);
};

// /**
//  * Update subcategory into category by id
//  * @param {ObjectId} catId
//  * @param {Object} subCatId
//  * @returns {Promise<Category>}
// **/
// const updateSubCatIntoCategoryById = async (catId, subCatId) => {
//     const options = {
//         new: true,
//         omitUndefined: true
//     }
//     return await Category.findByIdAndUpdate(
//         mongoose.Types.ObjectId(catId),
//         { $push: 
//             { 
//                 subCategories: subCatId,
//             } 
//         }, 
//         options
//     );
// };

/**
 * Update subcategory into category by id
 * @param {ObjectId} catId
 * @param {Object} subCatId
 * @returns {Promise<Category>}
**/
const updateSubCatIntoCategoryById = async (catId, subCatId) => {
    const options = {
        new: true,
        omitUndefined: true
    }
    return await Category.findByIdAndUpdate(
        mongoose.Types.ObjectId(catId),
        { $push: 
            { 
                subCategories: subCatId,
            } 
        }, 
        options
    );
};

/**
 * Delete category by id
 * @param {ObjectId} catId
 * @returns {Promise<category>}
**/
const deleteCategoryById = async (catId) => {
    const subs = await SubCategory.find({ category: mongoose.Types.ObjectId(catId) });
    if (subs && subs.length) {
        throw new ApiError('This Category have some subcategories!', httpStatus.BAD_REQUEST);
    }
    return await Category.findByIdAndDelete(mongoose.Types.ObjectId(catId));
};

const getAll = async(query) => {
    let categoryQuery = Category.find();

	if (query) {
		if (!query.q) {
			query.q = '.';
		}
		categoryQuery.find({$or: [
            {
                name: { $regex: query.q, $options: 'i' },
            },
            
        ],
        })
    
			
	}

    const totalResults = await Category.countDocuments(categoryQuery);

    categoryQuery.sort([[`${query._sort}`, query._order === 'ASC' ? 1 : -1]])
			.skip(parseInt(query._start))
			.limit(10)
	const cats = await categoryQuery.exec();

    // let subCategoryQuery = SubCategory.find().populate({ path: 'user', select: 'name'});

	// if (query) {
	// 	if (!query.q) {
	// 		query.q = '.';
	// 	}
	// 	subCategoryQuery.find({ name: { $regex: query.q, $options: 'i' }})
	// 		.sort([[`${query._sort}`, query._order === 'ASC' ? 1 : -1]])
	// 		.skip(parseInt(query._start))
	// 		.limit(10)
	// }
	// let subCats = await subCategoryQuery.exec();

    return {result: cats, totalResults};
}

module.exports = {
    createCategory,
    getCategoryById,
    getCategories,
    queryAllCategories,
    updateCategoryById, 
    updateSubCatIntoCategoryById,
    deleteCategoryById,

    getAll
}
