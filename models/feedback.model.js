const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Feedbackchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
		},
    courseId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Course',
			required: true
    },
		rating: {
			type: Number,
			require: true,
			min: 1, 
			max: 5
			
		},
		ratingContent: {
			type: String
		}
	},
	{
	timestamps: true,
	collection: 'feedbacks',
	}
);	

Feedbackchema.set('toObject', { getters: true });
Feedbackchema.set('toJSON', { getters: true });
Feedbackchema.plugin(mongoosePaginate);

const Feedback = mongoose.model('Feedback', Feedbackchema);

module.exports = Feedback;

