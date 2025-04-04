import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      //console.log("Connected to database:", db.databaseName);
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn('users');
export const shows = getCollectionFn('shows');
