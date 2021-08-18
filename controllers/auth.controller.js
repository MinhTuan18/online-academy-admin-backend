const { authService, tokenService, userService, otpService, nodemailerService } = require('../services');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        // console.log(user);
        //const accessToken = await tokenService.generateAuthTokens(user);
        const { otp, hash } = otpService.generateOTP(user.email);
        // console.log(hash);
        const result = await nodemailerService.sendOTP(user.email, otp);
        res.status(201).json(
            { 
                message: 'Successfully Registered! Please activate your account by providing the otp sent to you through your email', 
                data: user, 
                //accessToken: accessToken.token, 
                //expiresIn: accessToken.expires,
                otp,
                hash
            }
        );
    } catch (error) {
        // console.log(error);
        res.status(error.statusCode || 500).json({message: error.message});
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    //console.log(email + password);
    try {
        const user = await authService.loginWithEmailAndPassword(email, password);
        // console.log(user);
        const accessToken = await tokenService.generateAuthTokens(user);
        // console.log(accessToken);
        res.status(200).json({ message: 'Successfully Logged In', data:  { isAuthenticated: true, user, accessToken: accessToken.token, expiresIn: accessToken.expires } });
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message);
    }
};

const changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json('Old password and new password is required');
      }
      const accessToken = req.headers['x-access-token'];
      const user = await tokenService.verifyToken(accessToken);
      const result = await userService.changePassword(user, oldPassword, newPassword);
      if (!result) {
        return res.status(500).json('Cannot change password');
      }
      res.status(200).json({message: 'Change password successfully', success: true});
    } catch (error) {
      res.status(error.statusCode || 500).json({message: error.message});
    }
};

const activateAccount =  async (req, res) => {
  const { email, otp, hash } = req.body;
  try {
    if (otpService.verifyOTP(otp, hash, email)) {
      const activatedAccount = await userService.updateActivatedStatus(email);
      res.status(200).json({ verified: true, message: 'Successfully activated account', userData: activatedAccount});
    }
    res.status(400).json({verified: false, expired: false, message: 'OTP is not correct. Try again later'})
  } catch (error) {
    res.status(400).json({verified: false, expired: true, message: 'OTP expired. Try again later'})
  }
}

const resendOTP = async (req, res) => {
  const { email } = req.body;
  const { otp, hash } = otpService.generateOTP(email);
  // console.log(hash);
  const sendOTPResult = await nodemailerService.sendOTP(email, otp);
  res.status(200).json({ success: true, message: 'Successfully resent OTP to user email', hash});
}
  
module.exports = {
  register,
  login,
  changePassword,
  activateAccount,
  resendOTP,
}
