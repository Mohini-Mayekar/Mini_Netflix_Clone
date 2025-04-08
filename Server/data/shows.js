import { shows } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateId } from '../helper.js';



const getAllShows = async (page, limit) => {

    if (typeof page !== 'number' || page < 1) throw 'Page must be a positive number';
    if (typeof limit !== 'number' || limit < 1) throw 'Limit must be a positive number';
    const showsCollection = await shows();
    const skip = (page - 1) * limit;
    const showsList = await showsCollection.find({}).skip(skip).limit(limit).toArray();
    if (showsList.length == 0) throw `No Shows present'.`;

    const totalCount = await showsCollection.countDocuments();
    return {
        shows: showsList,
        totalCount: totalCount
    };
};

const getShowById = async (id) => {
    //id = validateId(id, 'id');// assuming it is ObjectId
    id = validateId(id, 'id');
    const showsCollection = await shows();
    const existingShow = await showsCollection.findOne({ _id: ObjectId.createFromHexString(id) });
    if (existingShow === null) throw `No show with id '${id}'.`;
    //delete existingShow._id;    
    return existingShow;
};


export default {
    getAllShows, getShowById
}
