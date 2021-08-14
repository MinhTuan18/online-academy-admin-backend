const sha256 = require('js-sha256');

const { nodemailerService } = require('../services');

const envConfigs = require('../configs/enviroment-config');

const ApiError = require('../utils/ApiError');

// const DURATION_IN_MINUTE = 1

/*  sendOTP
    request:
    {
        email
    }
    response:
    {
        email
        hash
    }
 */

const generateOTP = (email) => {
    const otp = Math.floor(100000 + Math.random() * 899999)
    const duration = envConfigs.otp.durationInMinute * 60 * 1000
    const expiresAt = Date.now() + duration
    console.log(expiresAt);
    const data = `${email}.${otp}.${expiresAt}`
    const dataHash = sha256.hex(data)
    const hash = `${dataHash}.${expiresAt}`
    return {otp, hash};
}

const sendOtp =  (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            msg: 'Missing request body'
        });
    }

    const otp = Math.floor(100000 + Math.random() * 899999)
    const duration = DURATION_IN_MINUTE * 60 * 1000
    const expiresAt = Date.now() + duration


    const data = `${email}.${otp}.${expiresAt}`
    const dataHash = sha256.hex(data)
    const hash = `${dataHash}.${expiresAt}`

    try {
        mailer.sendOTP(email, otp)
        res.status(200).json({
            msg: 'OTP email sent',
            email,
            hash
        })
    } catch {
        res.status(400).json({
            msg: 'Failed to send OTP email'
        });
    }
}



/*  verifyOTP
    request:
    {
      email
      hash
      otp
    }
 */
/*const verifyOtp = function (req, res) {
    const email = req.body.email
    const hash = req.body.hash
    const otp = req.body.otp
    if (!email || !hash || !otp) {
        return res.status(400).json({
            msg: 'Missing request body'
        });
    }

    let [dataHash, expiresAt] = hash.split('.')

    let now = Date.now()
    if (now > parseInt(expiresAt)) {
        return res.status(400).send({ msg: 'OTP expires! Please try again' })
    }
    let data = `${email}.${otp}.${expiresAt}`
    let checkHash = sha256.hex(data)
    if (checkHash === dataHash) {
        return res.status(200).send({ msg: 'OTP verified' })
    } else {
        return res.status(400).send({ msg: 'Incorrect OTP' })
    }
}
*/

const verifyOTP = (otp, hash, email) => {
    let [dataHash, expiresAt] = hash.split('.')

    let now = Date.now()
    if (now > parseInt(expiresAt)) {
        throw new ApiError('OTP expires! Please try again', 400);
    }
    let data = `${email}.${otp}.${expiresAt}`
    let checkHash = sha256.hex(data)
    if (checkHash === dataHash) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    verifyOTP, 
    generateOTP,
} 
