import { verifyAccessToken } from '../tokenHelper.js';
import { authData } from '../data/index.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const email = req.headers.user;
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = verifyAccessToken(token);

        if (decoded.email != email) {
            return res.status(403).send('Access denied: Token/user mismatch');
        }
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



