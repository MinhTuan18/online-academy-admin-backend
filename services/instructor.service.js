const { User } = require('../models');
const bcrypt = require('bcryptjs');

const getAllInstructors = async (query) => {
	let instructorQuery = User.find({ role: 'instructor' }).select('-password');

	if (query) {
		if (!query.q) {
			query.q = '.';
		}
		instructorQuery.find({
			$or: [
				{
					name: { $regex: query.q, $options: 'i' },
				},
				{
					email: { $regex: query.q, $options: 'i' },
				},
			],
		})
			.sort([[`${query._sort}`, query._order === 'ASC' ? 1 : -1]])
			.skip(parseInt(query._start))
			.limit(10)
	}
	const instructors = await instructorQuery.exec();
  return instructors;
};
  
const getInstructorById = async (id) => {
	const instructor = await User.findById(id).select('-password');
	return instructor;
};

const addNewInstructor = async (instructor) => {
	const newInstructor = new User(instructor);
  newInstructor.password = bcrypt.hashSync(instructor.password, 10);
	const result = await newInstructor.save();
	return result.toObject();
};

const blockInstructor = async (id, status) => {
	const result = await User.findByIdAndUpdate({_id: id}, {isBlocked: status}, {new: true});
	return result;
};

module.exports = {
  getAllInstructors,
  getInstructorById,
  addNewInstructor,
  blockInstructor,
}