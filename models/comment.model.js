const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const CommentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    student: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'comments',
  }
);

CommentSchema.set('toObject', { getters: true });
CommentSchema.set('toJSON', { getters: true });
CommentSchema.plugin(paginate);

/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
