const mongoose = require('mongoose');

const WatchListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'User',
    },
    course: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: 'Course',
    },
  },
  {
    timestamps: true,
    collection: 'watchlists',
  }
);

WatchListSchema.set('toObject', { getters: true });
WatchListSchema.set('toJSON', { getters: true });


const WatchList = mongoose.model('WatchList', WatchListSchema);

module.exports = WatchList;