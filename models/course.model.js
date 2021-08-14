const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

// const Category = require('./category.model');

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String, 
            required: [true, 'Course Title Is Required'],
            index: true,
        },
        subCategory: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'SubCategory',
            required: [true, 'Course Sub-Category Is Required'],
        },
        thumbnailImageUrl: {
            type: String, 
            trim: true,
            default: '',
        },
        instructor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: [true, 'Course Instructor Is Required'],
        },
        shortDesc: {
            type: String, 
            default: '',
        },
        detailDesc: {
            type: String, 
            default: '',
        },
        averageRating: {
            type: Number, 
            min: 0, 
            max: 5, 
            default: 0.0,
        },
        totalRatings: {
            type: Number, 
            default: 0,
        },
        comments: {
            type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Feedback' }],
            default: [],
        },
        registeredStudents: {
            type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
            default: [],
        },
        // numOfRatings: {
        //     type: Number, 
        //     default: 0,
        // },
        // numOfRegistrations: {
        //     type: Number, 
        //     default: 0,
        // },
        fee: {
            type: Number, 
            default: 0,
        },
        discount: {
            type: Number, 
            default: 0.0, 
            min: 0, 
            max: 1,
        },
        status: {
            // 'Complete', 'Ongoing'
            type: String, 
            trim: true,
            default: 'Ongoing',
        }, 
        isBlocked: {
            type: Boolean,
            default: false,      
        },
        totalViews: {
            type: Number,
            default: 0,
        },
        
    },
    {
        timestamps: true,
        collection: 'courses',
    }
);

// text search
CourseSchema.index({ title: 'text' });

CourseSchema.set('toObject', { getters: true });
CourseSchema.set('toJSON', { getters: true });
CourseSchema.plugin(mongoosePaginate);
CourseSchema.plugin(aggregatePaginate);

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;

