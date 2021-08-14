const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');

const getAllUsers = async () => {
	const users = await User.find().select('-password');
  return users;
};
  
const getUserById = async (id) => {
	const user = await User.findById(id).select('-password');
	return user;
};

const addNewUser = async (user) => {
	const newUser = new User(user);
  user.password = bcrypt.hashSync(user.password, 10);
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