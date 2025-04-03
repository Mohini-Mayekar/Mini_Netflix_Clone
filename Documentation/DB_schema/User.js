const user = {
    "_id": new ObjectId(), //or integer
    "firstName": String,
    "lastName": String,
    "username": String,
    "password": String,   // hashed password
    "watchlist": [ObjectId("ShowsId")]
}