const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Course',
    },
    index: {
      type: Number,
      min: 0,
    },
    name: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true, 
    }
  },
  {
    timestamps: true,
    collection: 'chapters',
  }
);

ChapterSchema.set('toObject', { getters: true });
ChapterSchema.set('toJSON', { getters: true });


const Chapter = mongoose.model('Chapter', ChapterSchema);

module.exports = Chapter;