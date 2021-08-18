const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');

const getAllUsers = async (query) => {
	let userQuery = User.find({ role: 'user' }).select('-password');

	if (query) {
		if (!query.q) {
			query.q = '.';
		}
		userQuery.find({
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
	const users = await userQuery.exec();
  return users;
};
  
const getUserById = async (id) => {
	const user = await User.findById(id).select('-password');
	return user;
};

const addNewUser = async (user) => {
	const newUser = new User(user);
  newUser.password = bcrypt.hashSync(user.password, 10);
	const result = await newUser.save();
	return result.toObject();
};

const blockUser = async (id, status) => {
	const result = await User.findByIdAndUpdate({_id: id}, {isBlocked: status}, {new: true});
	return result;
};

module.exports = {
  getAllUsers,
  getUserById,
  addNewUser,
  blockUser,
}