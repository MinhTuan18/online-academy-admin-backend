const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
    port: process.env.PORT,
    mongoose: {
        url: process.env.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES
        // refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        // resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        // verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    },
    otp: {
        durationInMinute: process.env.DURATION_IN_MINUTE,
    },
    nodemailer: {
        clientId: process.env.NODEMAILER_CLIENT_ID,
        email: process.env.NODEMAILER_EMAIL,
        rfToken: process.env.NODEMAILER_RFTOKEN,
        secret: process.env.NODEMAILER_SECRET,
    },
}
