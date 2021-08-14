const httpStatus = require('http-status');
// const tokenService = require('./token.service');
const userService = require('./user.service');
// const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const bcrypt = require("bcryptjs");

// const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
**/
const loginWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    //console.log(user);
    if (!user) {
        throw new ApiError('User Not Existed', httpStatus.BAD_REQUEST);
    }
    if (!user.isActivated) {
        throw new ApiError('User is not activated', httpStatus.UNAUTHORIZED);
    }
    if (user.isBlocked) {
        throw new ApiError('User is blocked', httpStatus.FORBIDDEN);
    }
    if (!bcrypt.compareSync(password, user.password)) {
        throw new ApiError('Incorrect Password', httpStatus.BAD_REQUEST);
    }
    return user;
};

module.exports = {
  loginWithEmailAndPassword,
};
