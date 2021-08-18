const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const envConfigs = require('../configs/enviroment-config');

const email = envConfigs.nodemailer.email;

const oAuth2Client = new google.auth.OAuth2({
  CLIENT_ID: envConfigs.nodemailer.clientId,
  ClIENT_SECRET: envConfigs.nodemailer.secret,
  REDIRECT_URI: 'https://developers.google.com/oauthplayground',
});

oAuth2Client.setCredentials({
  refresh_token: envConfigs.nodemailer.rfToken,
});

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true, // true for 465, false for other ports
  pool: true,
  auth: {
    type: 'OAuth2',
    user: email,
    // Get From Google Console OAuth Credential
    clientId: envConfigs.nodemailer.clientId,
    clientSecret: envConfigs.nodemailer.secret,
    // Get From Google Developer OAuth20 PlayGround
    refreshToken: envConfigs.nodemailer.rfToken,
    access_token: async () => oAuth2Client.getAccessToken(),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  sendOTP: (receiverEmail, otp) => {
    const mailOptions = {
      from: `Online Academy ${email}`,
      to: `${receiverEmail}`,
      subject: 'Activate Online Academy Account',
      text: `Provide following OTP to activate your account: ${otp} \n  If this is not you, ignore this email!`,
    };
    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          resolve({
            success: false,
            error,
          });
        } else {
          resolve({
            success: true,
            info,
          });
        }
      });
    });
  },

  sendMail: (receiverEmail, message) => {
    const mailOptions = {
      from: `Online Academy ${email}`,
      to: `${receiverEmail}`,
      subject: 'Activate Online Academy Account',
      text: message,
    };
    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          resolve({
            success: false,
            error,
          });
        } else {
          resolve({
            success: true,
            info,
          });
        }
      });
    });
  },
}