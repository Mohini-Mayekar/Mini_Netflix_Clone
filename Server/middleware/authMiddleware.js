// import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
// dotenv.config();

// export const verifyToken = (req, res, next) => {
//     console.log(req.header('Authorization'));
//     const token = req.header('Authorization')?.split(' ')[1];
//     console.log('TOken' + token);
//     if (!token) return res.status(401).json({ message: 'Access Denied' });
//     try {
//         console.log('HE Middleware');
//         const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         req.user = verified;
//         console.log('Middleware');
//         console.log(verified);
//         console.log('REQ here');
//         console.log(req.user);
//         next();
//     } catch (err) {
//         res.status(400).json({ message: 'Invalid Token' });
//     }
// };


import { verifyAccessToken } from '../tokenHelper.js';
import { authData } from '../data/index.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = verifyAccessToken(token);

        const user = await authData.getUserByEmail(decoded.email);

        if (!user) return res.status(401).json({ error: 'Invalid token' });

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};



