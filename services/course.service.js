const mongoose = require('mongoose');
const { Course, SubCategory, Category, RegisteredCourse, Feedback } = require('../models');

/**
 * Create a course
 * @param {Object} courseInfo
 * @returns {Promise<Course>}
**/
const createCourse = async (courseInfo) => {
    const { subCategory } = courseInfo;
    const course = await Course.create(courseInfo);
    // console.log(course);
    const { id: courseId } = course; 
    const options = {
        new: true,
        omitUndefined: true
    }
    await SubCategory.findByIdAndUpdate(
        mongoose.Types.ObjectId(subCategory),
        { $push: 
            { 
                courses: courseId,
            } 
        }, 
        options
    );
    return course;
};

/**
 * Query for all courses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
const queryCourses = async (filter, options) => {
    const courses = await Course.paginate(filter, options);
    return courses;
};

/**
 * Query for courses follow category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
 const queryCoursesFilterByTitle = async (filter, options) => {
    const { title } = filter;
    const { sort, limit, skip } = options;
    const queryFilter = [
        { $match: { $text: { $search: title } } },
        {
            $project: {
                title: 1,
                subcategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $unwind: '$instructorName',
        },
        {
            $project: {
                instructor: 0,
            }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
    ];
  
    // // status: 2 - published
    // const queryTotal = { status: 2 };
  
    // if (name.length > 0) {
    //   queryFilter.unshift({
    //     $match: { $text: { $search: name } },
    //   });
  
    //   queryTotal.$text = { $search: name };
    // }
  
    // const total = await Course.find(queryTotal).count();
  
    const courses = await Course.aggregate(queryFilter);
    // console.log(courses);
    const totalResults = await Course.find({$text: {$search: title}}).countDocuments();
    return { courses, totalResults };
};

/**
 * Query for courses by category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
const queryCoursesFilterByCategory = async (filter, options) => {
    const { title, id } = filter;
    const { sort, limit, skip } = options;

    // query course ids belong to categeory
    const querySubcatCoursesInCategory = [
        { $match: { _id: id } },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategories',
                foreignField: '_id',
                as: 'subCategories',
            },
        },
        { $unwind: '$subCategories' },
        { $group: 
            { 
                _id: '$_id', 
                subCatCourseIds: { $push: '$subCategories.courses' } 
            } 
        },
    ];
  
    const querySubcatsCoursesInCategoryResults = await Category.aggregate(querySubcatCoursesInCategory);
    // console.log(querySubcatsCoursesInCategoryResults);
    const { subCatCourseIds } = querySubcatsCoursesInCategoryResults[0];
    let courseIds = [];
    subCatCourseIds.forEach(subCatCourseId => {
      courseIds = [...courseIds, ...subCatCourseId];
    });

    // Query courses by courseIds
    const queryFilter = [
        { $match: { _id: { $in: courseIds } } },
        {
            $project: {
                title: 1,
                subcategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $unwind: '$instructorName',
        },
        {
            $project: {
                instructor: 0,
            },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
    ];
  
    const queryTotalResults = {
        _id: { $in: courseIds },
    };
  
    if (title && title.length > 0) {
        queryFilter.unshift({
            $match: { $text: { $search: title } },
        });

        queryTotalResults.$text = { $search: title };
    }
  
    const courses = await Course.aggregate(queryFilter);  
    const totalResults = await Course.find(queryTotalResults).countDocuments();
    return { courses, totalResults };
};

/**
 * Query for courses follow sub category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
 const queryCoursesFilterBySubCategory = async (filter, options) => {
    const { title, id } = filter;
    const { sort, limit, skip } = options;

    const { courses: courseIds } = await SubCategory.findById(id);

    // status: 2 - published
    const queryFilter = [
        { $match: { _id: { $in: courseIds } } },
        {
            $project: {
                title: 1,
                subcategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $unwind: '$instructorName',
        },
        {
            $project: {
                instructor: 0,
            },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
    ];

    const queryTotalResults = {
        _id: { $in: courseIds },
    };

    if (title.length > 0) {
        queryFilter.unshift({
            $match: { $text: { $search: title } },
        });

        queryTotalResults.$text = { $search: title };
    }

    const totalResults = await Course.find(queryTotalResults).countDocuments();
    const courses = await Course.aggregate(queryFilter);
    // const resultTotal = await Course.find({$text : { $search: title }, _id: { $in: courseIds }}).countDocuments();
    return { courses, totalResults };
};

/**
 * Query for advanced (with name, category, and sub-category) filter courses
 * @param {Object} filter - Query filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc) and seperated by ','
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
 const queryCoursesAdvancedFilter = async (filter, options) => {
    // console.log(filter);
    const categoryId = filter.category === undefined ? undefined : new mongoose.Types.ObjectId(filter.category);
    const subCategoryId = filter.subCategory === undefined ? undefined : new mongoose.Types.ObjectId(filter.subCategory);
    const title = filter.title === undefined ? undefined : filter.title;

    const limit = options.limit ? options.limit : 10;
    const page = options.page ? options.page : 1;
    const skip = (page - 1) * limit;
  
    const sort = {};
    if (options.sortBy) {
        options.sortBy.split(',').forEach((sortOption) => {
            const [key, sortOrder] = sortOption.split(':');
            sort[key] = sortOrder === 'desc' ? -1 : 1;
        });
    } else {
        sort.createdAt = 1;
    }
  
    let result;
  
    if (categoryId === undefined && subCategoryId !== undefined) {
        result = await queryCoursesFilterBySubCategory(
            { id: subCategoryId, title: filter.title || '' },
            { limit, skip, sort }
        );
    } else if (categoryId !== undefined && subCategoryId === undefined) {
        result = await queryCoursesFilterByCategory(
            { id: categoryId, title: filter.title || '' }, 
            { limit, skip, sort }
        );
    } else if (title) {
        result = await queryCoursesFilterByTitle({ title: filter.title || '' }, { limit, skip, sort });
    }
    else {
        // console.log('OK');
        result = await queryCourses({}, { limit, skip, sort });
        const { docs: courses, totalDocs: totalResults, totalPages } = result;    
        return { courses, totalResults, totalPages, limit };
    }
  
    const { courses, totalResults } = result;
    const totalPages = Math.ceil(totalResults / limit);
  
    return { courses, totalResults, totalPages, limit };
};

/**
 * Query for most-view courses
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
**/
const queryMostViewCourses = async () => {
    const courses = await Course.aggregate([
        {
            $match: {
                isBlocked: false,
            },
        },
        {
            $project: {
                title: 1,
                subCategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
            },
        },
        { $sort: { totalViews: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategory',
            },
        },
        {
            $addFields: {
                subCategoryName: '$subCategory.name',
            },
        },
        {
            $project: {
                subCategory: 0
            },
        },
        {
            $unwind: '$subCategoryName',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $project: {
                instructor: 0,
            },
        },
        {
            $unwind: '$instructorName',
        },
    ]);
  
    return courses;
};

/**
 * Query for newest courses
 * @returns {Promise<QueryResult>}
**/
const queryNewestCourses = async () => {
    // isBlocked: false - published
  
    const courses = await Course.aggregate([
        {
            $match: {
                isBlocked: false,
            },
        },
        {
            $project: {
                title: 1,
                subCategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
                createdAt: 1,
            },
        },
        { $sort: 
            { createdAt: -1 } 
        },
        { $limit: 10 },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'subCategory',
                foreignField: '_id',
                as: 'subCategory',
            },
        },
        {
            $addFields: {
                subCategoryName: '$subCategory.name',
            },
        },
        {
            $project: {
                subCategory: 0
            },
        },
        {
            $unwind: '$subCategoryName',
        },
        {
            $lookup: {
                from: 'users',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $project: {
                instructor: 0,
            },
        },
        {
            $unwind: '$instructorName',
        },
    ]);
    return courses;
};

/**
 * Query for outstanding courses
 * @returns {Promise<QueryResult>}
**/
const queryOutstandingCourses = async () => {
    const start = moment().subtract(7, 'days').toDate().toISOString();
  
    // status: 2 - published
    const courses = await Course.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: start,
                },
                isBlocked: false,
            },
        },
        {
            $project: {
                title: 1,
                subCategory: 1,
                thumbnailImageUrl: 1,
                instructor: 1,
                averageRating: 1,
                totalRatings: 1,
                fee: 1,
                discount: 1,
                createdAt: 1,
                totalComments: {
                    $size: '$comments',
                },
                totalViews: 1,
            },
        },
        { $sort: 
            { totalViewer: -1 } 
        },
        { $limit: 10 },
        {
            $lookup: {
                from: 'user',
                localField: 'instructor',
                foreignField: '_id',
                as: 'instructor',
            },
        },
        {
            $addFields: {
                instructorName: '$instructor.name',
            },
        },
        {
            $project: {
                instructor: 0,
            },
        },
        {
            $unwind: '$instructorName',
        },
        { $sort: 
            { createdAt: -1 } 
        },
        { $limit: 4 },
    ]);
    return courses;
};

/**
 * Query for best seller courses
 * @returns {Promise<QueryResult>}
**/
const queryBestSellerCourses = async () => {  
    // isBlocked: false - published
    const registeredCourses = await RegisteredCourse.aggregate([
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        { $unwind: '$course' },
        {
            $group: {
                _id: '$course',
                count: { $sum: 1},
            }
        },
        { $sort: {count: -1} },
        { $limit: 10 },
        { 
            $addFields: {
                course: '$_id',
            },
        },
        {
            $project: {
                _id: 0,
            }
        },
    ]);
    
    return registeredCourses;
};

/**
 * get course by id
 * @param {ObjectId} courseId
 * @returns {Promise<Course>}
**/
const getCourseById = async (courseId) => {
    return Course.findById(mongoose.Types.ObjectId(courseId)).populate([
        {
            path: 'subCategory',
            select: 'name',
        },
        {
            path: 'instructor',
            select: 'name',
        }
    ]);
};

/**
 * Update course by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @returns {Promise<Course>}
**/
const updateCourseById = async (courseId, updateBody) => {
    const options = {
        new: true,
        omitUndefined: true
    }
    return await Course.findByIdAndUpdate(mongoose.Types.ObjectId(courseId), updateBody, options);
};

/**
 * Delete course by id
 * @param {ObjectId} courseId
 * @returns {Promise<Course>}
**/
const deleteCourseById = async (courseId) => {
    return await Course.findByIdAndDelete(mongoose.Types.ObjectId(courseId));
};

// /**
//  * Query for courses of one category
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResults>}
// **/
// const queryCoursesByCategoryId = async (filter, options) => {
//     //console.log(filter);
//     if (!filter) filter = {};
//     if (!options) options = {
//         sort: {
//             title: 1
//         },
//         limit: 10,
//         page: 1
//     }
//     const { category } = filter;
//     filter.category = mongoose.Types.ObjectId(category);
//     return await Course.paginate(filter, options);
// }

const getCourses = async (query) => {
    let courseQuery = Course.find()
                        .populate([
                            {
                                path: 'subCategory',
                                select: 'name',
                            },
                            {
                                path: 'instructor',
                                select: 'name',
                            }
                        ])
    if (query) {
        if (query.instructor) {
            courseQuery.find({instructor: query.instructor});
        }

        if (query.subCategory) {

            courseQuery.find({subCategory: query.subCategory});
        }

        if (query.q) {
            courseQuery.find({ $text: { $search: query.q } })

        }
        courseQuery.sort([[`${query._sort}`, query._order === 'ASC' ? 1 : -1]])
			.skip(parseInt(query._start))
			.limit(10);
	}

    let courses = await courseQuery;
                               
    
    // if (courses) {
    //     courses = await Promise.all(courses.map(async (course) => {
    //         course.instructorName = course.instructor.name;
    //         delete course.instructor;

    //         course.category= course.subCategory.name;
    //         delete course.subCategory;

    //         const totalRatings = await Feedback.find({ courseId: course._id}).countDocuments();
    //         course.totalRatings = totalRatings;
    //         return course;
    //     }));
    // }
    return courses;
}

module.exports = {
    createCourse,
    queryCourses,
    queryCoursesFilterByTitle,
    queryCoursesAdvancedFilter,
    queryMostViewCourses,
    queryNewestCourses,
    queryBestSellerCourses,
    getCourseById,
    updateCourseById,
    deleteCourseById,

    getCourses
};
