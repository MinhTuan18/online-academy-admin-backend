const mongoose = require('mongoose');
const { SubCategory, Course, RegisteredCourse, Category } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const moment = require('moment');

/**
 * Create a subcategory
 * @param {Object} subCategoryInfo
 * @returns {Promise<SubCategory>}
**/
const createSubCategory = async (subCategoryInfo) => {
    const { category } = subCategoryInfo;
    const newSubCategory = await SubCategory.create(subCategoryInfo);
    const { id: subCatId } = newSubCategory; 
    // console.log(newSubCategory);
    const options = {
        new: true,
        omitUndefined: true
    }
    await Category.findByIdAndUpdate(
        mongoose.Types.ObjectId(category),
        { $push: 
            { 
                subCategories: subCatId,
            } 
        }, 
        options
    );
    return newSubCategory;
};

/**
 * Get a subCategory by id
 * @param {ObjectId} subCatId
 * @returns {Promise<SubCategory>}
**/
const getSubCategoryById = async (subCatId) => {
    return await SubCategory.findById(mongoose.Types.ObjectId(subCatId)).populate({path: 'category', select: 'name'});
};

/**
 * Get subcategories
 * @returns {Promise<SubCategory>}
**/
const getSubCategories = async () => {
    return await SubCategory.paginate();
};

/**
 * Update a subcategory by id
 * @param {ObjectId} subCatId
 * @param {Object} updateBody
 * @returns {Promise<SubCategory>}
**/
const updateSubCategoryById = async (subCatId, updateBody) => {
    const options = {
        new: true,
        omitUndefined: true
    }
    return await SubCategory.findByIdAndUpdate(mongoose.Types.ObjectId(subCatId), updateBody, options);
};

/**
 * Delete subCategory by id
 * @param {ObjectId} subCatId
 * @returns {Promise<sSubCategory>}
**/
const deleteSubCategoryById = async (subCatId) => {
    const courses = await Course.find({ subCategory: mongoose.Types.ObjectId(subCatId) });
    if (courses && courses.length) {
        throw new ApiError('This sub-category have some courses!', httpStatus.BAD_REQUEST);
    }
    return await SubCategory.findByIdAndDelete(mongoose.Types.ObjectId(subCatId));
};

/**
 * Query for subcategories
 * @param {Object} filter - Query filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc) and seperated by ','
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
const querySubCategories = async (filter, options) => {
    const { subcategory } = filter;
    if (subcategory) {
        filter.category = mongoose.Types.ObjectId(category);
    }
    const subcategories = await SubCategory.paginate(filter, options);
    return subcategories;
};

/**
 * Query for top 4 most registered subcategories last 7 days
 * @returns {Promise<QueryResult>}
**/
const queryMostRegisteredSubCategoryLast7Days = async () => {
    const startingPoint = moment().subtract(7, 'days').toDate().toISOString();
    console.log(startingPoint);
    const registeredCourses = await RegisteredCourse.aggregate([
        {
            $project: {
                course: 1,
                student: 1,
                createdAt: 1,
                registeredInLast7Days: {
                    $gte: ['$createdAt', startingPoint]
                }
            },
        },
        {
            $match: {
                registeredInLast7Days: true,
            },
        },
        {
            $project: {
                registeredInLast7Days: 0,
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },            
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'course.subCategory',
                foreignField: '_id',
                as: 'course.subCategory',
            },
        },
        
        {
            $addFields: {
                subCategoryId: '$course.subCategory._id',
            },
        },

        {
            $unwind: '$course.subCategory'
        },
        {
            $unwind: '$subCategoryId'
        },
        {
            $project: {
                'course.subCategory': 0,
            }
        },
        {
            $group: 
            { 
                _id: { subCategoryId : '$subCategoryId' },
                // subCategoryId: { "$first": "$subCategoryId" },
                count: { $sum: 1 }
            } 
        },
        { $sort: { count: -1 } },
        { $limit: 4 },
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id.subCategoryId',
                foreignField: '_id',
                as: '_id.subCategory',
            },
        },
        {
            $addFields: {
                subCategory: '$_id.subCategory',
            },
        },
        {
            $unwind: '$subCategory'
        },
        {
            $project: {
                '_id': 0,
            }
        },
    ]);
    return registeredCourses;
}

const getAll = async (query) => {
    let categoryQuery = SubCategory.find().populate({path: 'category', select: 'name'});

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
			.sort([[`${query._sort}`, query._order === 'ASC' ? 1 : -1]])
			.skip(parseInt(query._start))
			.limit(10)
	}
	const cats = await categoryQuery.exec();

    return cats;
}

module.exports = {
    createSubCategory,
    getSubCategoryById,
    getSubCategories,
    updateSubCategoryById,
    deleteSubCategoryById,
    querySubCategories,
    queryMostRegisteredSubCategoryLast7Days,
    getAll
}
