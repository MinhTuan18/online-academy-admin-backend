const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const otpService = require('./otp.service');

const { User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
**/
const isEmailTaken = async (email) => {
  const user = await User.findOne({ email });
  //console.log(user);
  if (!user) return false;
  return true;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
**/
const createUser = async (userBody) => {
    // console.log(await isEmailTaken(userBody.email));
    if (await isEmailTaken(userBody.email)) {
        //console.log('2');
        throw new ApiError('Email has been already taken', httpStatus.BAD_REQUEST);
    }
    try {
        userBody.password = bcrypt.hashSync(userBody.password, 10);
        const user = await User.create(userBody);
        // const {otp, hash} = otpService.generateOTP(user.email);
        // // console.log(otp, hash);

        // //send mail after create account
        // mailer.sendOTP(user.email, otp);
        //console.log(user);
        return user;
    } catch (error) {
        throw new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR);
    }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
**/
const getUserById = async (id) => {
    return User.findById(mongoose.Types.ObjectId(id));
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
**/
const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const updateUserProfile = async (id, userInfo) => {
	const result = await User.findByIdAndUpdate({_id: id}, userInfo, {new: true});
	return result.toObject();
};

const updateActivatedStatus = async (email) => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new ApiError('User email not exist!', httpStatus.BAD_REQUEST);
    }
    if (user.isActivated) {
        throw new ApiError('This account have been activated', httpStatus.BAD_REQUEST);
    }
    return await User.findByIdAndUpdate({_id: user.id}, { isActivated: true }, { new: true });
};

const changePassword = async (user, oldPassword, newPassword) => {
    if (!bcrypt.compareSync(oldPassword, user.password)) {
        throw new ApiError('Incorrect Password', httpStatus.BAD_REQUEST);
    }
    const paswordHash = bcrypt.hashSync(newPassword, 10);
    return await User.findByIdAndUpdate({_id: user.id}, {password: paswordHash}, {new: true});
}

/**
 * Add course to watch list by id
 * @param {Object} user
 * @param {Object} course
 * @returns {Promise<User>}
**/
const updateWatchlist = async (user, course) => {
    const { _id: courseId } = course;
    const index = user.watchList.findIndex(e => e.toString() === courseId.toString());

    if (index === -1) {
        try {
            return await User.findByIdAndUpdate(
                mongoose.Types.ObjectId(user.id),
                { $push: 
                    { 
                        watchList: courseId,
                    } 
                }
            );
            // return true;
        } catch (error) {
            throw new ApiError('Failed to add course to watchlist', httpStatus.INTERNAL_SERVER_ERROR, error);
        }
    } 
    throw new ApiError('This course has already been added to watchlist', httpStatus.BAD_REQUEST);

    // return false;
}

module.exports = {
    isEmailTaken,
    createUser,
    getUserById,
    getUserByEmail,
    updateUserProfile,
    updateActivatedStatus,
    updateWatchlist,
    changePassword,
}
