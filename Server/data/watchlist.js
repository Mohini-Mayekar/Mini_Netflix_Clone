import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { authData, showsData } from '../data/index.js';
import { validateEmail, validateId } from '../helper.js';

const getUserWatchlist = async (email, page, limit) => {
    let watchlistData = [];
    const existingUser = await authData.getUserByEmail(email);
    if (typeof page !== 'number' || page < 1) throw "Page must be a positive number";
    if (typeof limit !== 'number' || limit < 1) throw "Limit must be a positive number";
    const watchlistArr = existingUser.watchlist;
    const totalCount = watchlistArr.length;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    let paginatedWatchlistArr = watchlistArr.slice(startIndex, endIndex);
    if (paginatedWatchlistArr.length == 0) {
        paginatedWatchlistArr = watchlistArr.slice(0, limit);
    }
    for (const showId of paginatedWatchlistArr) {
        try {
            const show = await showsData.getShowById(showId.toString());
            watchlistData.push(show);
        } catch (e) {
            console.error(`Skipping show ${showId}:`, e);
        }
    }
    return {
        watchlist: watchlistData,
        totalCount: totalCount
    };
}

const addToUserWatchlist = async (userId, showId) => {
    //id = validateId(id, 'id');// assuming it is ObjectId    
    userId = validateId(userId, 'userId');
    showId = validateId(showId, 'showId');
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
    const result = await usersCollection.updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $addToSet: { watchlist: ObjectId.createFromHexString(showId) } }
    );
    return result;
};

const removeFromUserWatchlist = async (userId, showId) => {
    userId = validateId(userId, 'userId');
    showId = validateId(showId, 'showId');
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
    const result = await usersCollection.updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $pull: { watchlist: ObjectId.createFromHexString(showId) } }
    );
    return result;
}


export default {
    addToUserWatchlist, removeFromUserWatchlist, getUserWatchlist
}




