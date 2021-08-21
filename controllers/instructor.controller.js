const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { userService, otpService, nodemailerService, courseService, adminService, authService, tokenService, instructorService } = require('../services');
const { isEmailTaken} = require('../services/user.service');
const getAllUsers = async (req, res) => {
  try {
    const {result, totalResults} = await instructorService.getAllInstructors(req.query);
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', totalResults);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json("User ID is required!!!");
  }
  try {
    const user = await instructorService.getInstructorById(id);
    if (!user) {
      return res.status(204).json();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
};

const addNewUser = async (req, res) => {
  const user = req.body;
  if (!user.email || !user.password || !user.name) {
    return res.status(400).json();
  }
  try {
    const isEmailExist = await isEmailTaken(user.email); //Check email exist
    if (isEmailExist) {
      return res.status(400).json(`Email ${user.email} exist!`);
    }

    const newUser = await instructorService.addNewInstructor(user);

    //create account success, send mail to user
    const message = `Dear ${newUser.name},\nYour ${newUser.role} account has been created with password: ${user.password}\nNow you can log in to Online Academy`;

    const mailer = await nodemailerService.sendMail(newUser.email, message);
    
    delete newUser.password;
    res.status(201).json(newUser);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
};

const updateProfile = async (req, res) => {
  const userInfo = req.body;
  const id = req.params.id;
  if (!id) {
    return res.status(400).json("User ID is required!!!");
  }

  try {
    const user = await userService.updateUserProfile(id, userInfo);
    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json(error.message);
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  addNewUser,
  updateProfile
}
