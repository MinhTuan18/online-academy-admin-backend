const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const RegisterdCourseSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Course',
    },
    student: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    }
  },
  {
    timestamps: true,
    collection: 'registeredCourses',
  }
);


RegisterdCourseSchema.set('toObject', { getters: true });
RegisterdCourseSchema.set('toJSON', { getters: true });
RegisterdCourseSchema.plugin(mongoosePaginate);


const RegisterdCourse = mongoose.model('RegisterdCourse', RegisterdCourseSchema);

module.exports = RegisterdCourse;