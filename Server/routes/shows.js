import express from 'express';
import { showsData } from '../data/index.js';
import { errorMsg, validateId } from '../helper.js';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const shows = await showsData.getAllShows();

            res.status(200).json({ status: "success", shows: shows });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }

    });

router.route('/:id')
    .get(async (req, res) => {
        try {
            req.params.id = validateId(req.params.id, 'id URL Param');
        } catch (e) {
            res.status(400).json(errorMsg(e));
            return;
        }
        try {
            const show = await showsData.getShowById(req.params.id);
            res.status(200).json({ status: "success", show: show });
        } catch (e) {
            res.status(404).json(errorMsg(e));
            return;
        }
    });

export default router;

