import { Router } from 'express';
import { validateEmail, validateId } from '../helper.js';
import { authData, watchlistData } from '../data/index.js';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        let reqData = req.body;
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
            const existingUser = await authData.getUserByEmail(email);
            res.status(200).json({ status: "success", watchlist: existingUser.watchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    })
    .post(async (req, res) => {
        let reqData = req.body;
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
            showId = reqData.showId;
            showId = validateId(showId, 'Show Id');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingUser = await authData.getUserByEmail(email);
            let addShowToWatchlist = await watchlistData.addToUserWatchlist(existingUser._id, showId);

            res.status(200).json({ status: "success", watchlist: addShowToWatchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    })
    .delete(async (req, res) => {
        let reqData = req.body;
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
            showId = reqData.showId;
            showId = validateId(showId, 'Show Id');
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            const existingUser = await authData.getUserByEmail(email);
            let addShowToWatchlist = await watchlistData.removeFromUserWatchlist(existingUser._id, showId);

            res.status(200).json({ status: "success", watchlist: addShowToWatchlist });
        } catch (e) {
            return res.status(500).json({ error: e });
        }

    });

export default router;

