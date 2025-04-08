import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import xss from 'xss';
import dotenv from "dotenv";
import { authData } from '../data/index.js';
import { validateEmail, validatePass } from '../helper.js';
import { generateTokens, verifyRefreshToken } from '../tokenHelper.js';

dotenv.config();
const router = express.Router();

router.route('/signup')
    .post(async (req, res) => {
        console.log('HERE');
        let reqData = req.body;
        let email;
        let pass;

        if (!reqData || Object.keys(reqData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }

        try {
            email = xss(reqData.email);
            email = validateEmail(email, 'Email');
            pass = xss(reqData.pass);
            pass = validatePass(pass, 'Password');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingUser = await authData.checkDuplicateEmail(email);
            const newUser = await authData.registerUser(email, pass);
            res.status(200).json({ status: "success", newUser: newUser });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    });

router.route('/login')
    .post(async (req, res) => {
        let reqData = req.body;
        console.log('REq');
        console.log(reqData);
        let email;
        let pass;

        if (!reqData || Object.keys(reqData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }

        try {
            email = xss(reqData.email);
            email = validateEmail(email, 'Email');
            pass = xss(reqData.pass);
            pass = validatePass(pass, 'Password');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            console.log('check if User exists!');
            const existingUser = await authData.getUserByEmail(email);
            console.log(existingUser);
            console.log('User exists!');
            let compareToMatch = await bcrypt.compare(pass, existingUser.pass);
            console.log(compareToMatch);
            if (!compareToMatch) throw `Either the email or password is invalid.`;
            const { accessToken, refreshToken } = generateTokens(email);
            await authData.updateToken(email, refreshToken);
            //const token = jwt.sign({ "email": email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            console.log('token');
            res.status(200).json({
                status: "success", token: {
                    accessToken,
                    refreshToken,
                    user: {
                        id: existingUser._id,
                        email: existingUser.email
                    }
                }
            });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    });

router.route('/refresh')
    .post(async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });

            const decoded = verifyRefreshToken(refreshToken);
            console.log('DECOded');
            console.log(decoded);

            // Verify refresh token against database
            const user = await authData.getToken(decoded.email, refreshToken);


            if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

            // Generate new tokens
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.email);

            // Update refresh token in database
            await authData.updateToken(email, newRefreshToken);

            res.json({ accessToken, refreshToken: newRefreshToken });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Refresh token expired' });
            }
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });

// Logout
router.route('/logout')
    .post(async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(400).json({ error: 'No refresh token provided' });

            const decoded = verifyRefreshToken(refreshToken);
            await authData.updateToken(decoded.email, null);

            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    });

export default router;

