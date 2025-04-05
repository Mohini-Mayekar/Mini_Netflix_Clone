import { Router } from 'express';
import { validateEmail, validateId } from '../helper.js';
import { authData, watchlistData } from '../data/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();
router.use(verifyToken);
router.route('/')
    .get(async (req, res) => {
        let reqData = req.user;
        let email;

        if (!reqData || Object.keys(reqData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }

        try {
            email = reqData.email;
            email = validateEmail(email, 'Email');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingWatchlist = await watchlistData.getUserWatchlist(email);
            res.status(200).json({ status: "success", watchlist: existingWatchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    })
    .post(async (req, res) => {
        let reqData = req.user;
        let reqBody = req.body;

        let email;
        let showId;

        if (!reqData || Object.keys(reqData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }

        try {
            email = reqData.email;
            email = validateEmail(email, 'Email');
            showId = reqBody.showId;
            showId = validateId(showId, 'Show Id');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingUser = await authData.getUserByEmail(email);
            let addShowToWatchlist = await watchlistData.addToUserWatchlist(existingUser._id.toString(), showId);
            //const existingWatchlist = await watchlistData.getUserWatchlist(email);
            res.status(200).json({ status: "success", watchlist: addShowToWatchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    })
    .patch(async (req, res) => {
        let reqData = req.user;
        let reqBody = req.body;
        let email;
        let showId;

        if (!reqData || Object.keys(reqData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }

        try {
            email = reqData.email;
            email = validateEmail(email, 'Email');
            showId = reqBody.showId;
            showId = validateId(showId, 'Show Id');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingUser = await authData.getUserByEmail(email);
            let delShowFromWatchlist = await watchlistData.removeFromUserWatchlist(existingUser._id.toString(), showId);
            //const existingWatchlist = await watchlistData.getUserWatchlist(email);
            res.status(200).json({ status: "success", watchlist: delShowFromWatchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    });

export default router;

