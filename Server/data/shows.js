import { shows } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateId } from '../helper.js';

import { showData } from '../data/index.js';

const showsCollection = await shows();

export const getAllShows = async () => {

    const showsList = showsCollection.find({});
    if (showsList === null) throw `No Shows present'.`;
    return showsList;
};

export const getShowById = async (id) => {
    id = validateId(id, 'id');// assuming it is ObjectId
    showsCollection = await shows();
    const existingShow = showsCollection.findOne({ id: ObjectId.createFromHexString(id) })
    if (existingShow === null) throw `No show with id '${id}'.`;
    return existingShow;
};

