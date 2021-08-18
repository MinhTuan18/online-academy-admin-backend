const tokenService = require('../services/token.service');

const auth = async (req, res, next) => {
    try {
        const accessToken = req.headers['x-access-token'];
        // console.log(accessToken);
        if (!accessToken) {
            return res.status(401).json('Invalid authorization! Access token not found');
        }
        const verification = await tokenService.verifyToken(accessToken);
        console.log(verification);
        if (verification) next();
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
}

const instructorAuth = async (req, res, next) => {
    try {
        const accessToken = req.headers['x-access-token'];
        // console.log(accessToken);
        if (!accessToken) {
            return res.status(401).json('Invalid authorization! Access token not found');
        }
        
        const verification = await tokenService.verifyToken(accessToken);
        // console.log(verification);
        if (!verification || verification.role !== 'instructor') {
            return res.status(402).json({message: 'Forbidden to get access to this resource'});
        }
        req.instructorId = verification._id;
        next();
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
}

const adminAuth = async (req, res, next) => {
    try {
    const accessToken = req.headers['x-access-token'];
    if (!accessToken) {
        return res.status(404).json('Invalid authorization! Access token not found');
    }
    
    const verfication = await tokenService.verifyToken(accessToken);
    if (!verfication || verfication.role !== 'admin') {
        return res.status(402).json('Access denied!');
    }
    next();
    } catch (error) {
        res.status(error.statusCode || 500).json({message: error.message});
    }
}
module.exports = {
    auth,
    instructorAuth,
    adminAuth
}
