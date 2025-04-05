import { shows } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateId } from '../helper.js';



const getAllShows = async () => {
    const showsCollection = await shows();
    const showsList = await showsCollection.find({}).toArray();
    if (showsList.length == 0) throw `No Shows present'.`;
    return showsList;
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
