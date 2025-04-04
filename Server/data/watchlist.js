import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateEmail, validateId } from '../helper.js';

const addToUserWatchlist = async (userId, showId) => {
    //id = validateId(id, 'id');// assuming it is ObjectId
    userId = validateId(userId, 'userId');
    showId = validateId(showId, 'showId');
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ _id: userId });
    const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { watchlist: showId } }
    );

    return result;
};

const removeFromUserWatchlist = async (userId, showId) => {
    userId = validateId(userId, 'userId');
    showId = validateId(showId, 'showId');
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ _id: userId });
    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { watchlist: showId } }
    );
    return result;
}


export default {
    addToUserWatchlist, removeFromUserWatchlist
}




