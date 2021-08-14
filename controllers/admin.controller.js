
const { adminService, authService, tokenService } = require('../services');
const { isEmailTaken} = require('../services/user.service');


const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json(users);
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
    const user = await adminService.getUserById(id);
    if (!user) {
      return res.status(204).json();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
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

    const newUser = await adminService.addNewUser(user);
    delete newUser.password;

    res.status(201).json(newUser);
  } catch (error) {
      res.status(500).json(error.message);
  }
};

const blockUser = async (req, res) => {
  const {id, status} = req.body;
  if (!id) {
    return res.status(400).json('User ID is required!');
  }
  try {
    const result = await adminService.blockUser(id, status);
    if (result) {
      res.status(200).json();
    }
    else {
      res.status(204).json();
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
    try {
      const user = await authService.loginWithEmailAndPassword(email, password);
      if (user.role !== 'admin') {
        return res.status(401).json({ message:'Access Denied. Only admin can log in' });
      }
      const accessToken = await tokenService.generateAuthTokens(user);
      res.status(200).json({ message: 'Successfully Logged In', data:  { isAuthenticated: true, user, accessToken: accessToken.token, expiresIn: accessToken.expires } });
    } catch (error) {
      res.status(error.statusCode || 500).json(error.message);
    }
}



module.exports = {
    getAllUsers,
    getUserById,
    addNewUser,
    blockUser,
    loginAdmin,
}