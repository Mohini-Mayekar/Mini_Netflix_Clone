import { dbConnection, closeConnection } from './config/mongoConnection.js';
import { shows } from './config/mongoCollections.js';
import dotenv from "dotenv";

dotenv.config();

const sampleShows = [
    {
        id: "1",
        title: "Stranger Things",
        description: "A thrilling Netflix original...",
        genre: "Sci-Fi",
        rating: "TV-14",
        thumbnail: "https://example.com/stranger.jpg",
        videoUrl: "https://dummyvideo.com/trailer1.mp4"
    },
    {
        id: "2",
        title: "Breaking Bad",
        description: "A chemistry teacher turns meth cook...",
        genre: "Drama",
        rating: "TV-MA",
        thumbnail: "https://example.com/breaking.jpg",
        videoUrl: "https://dummyvideo.com/trailer2.mp4"
    },
    {
        id: "3",
        title: "Money Heist",
        description: "A Spanish heist crime drama...",
        genre: "Thriller",
        rating: "TV-MA",
        thumbnail: "https://example.com/moneyheist.jpg",
        videoUrl: "https://dummyvideo.com/trailer3.mp4"
    }
    //TO DO: Need to add more shows data
];

const seedDB = async () => {
    try {
        const db = await dbConnection();
        await db.dropDatabase();
        console.log("Connected to MongoDB");

        const showsCollection = await shows();

        await showsCollection.insertMany(sampleShows);
        console.log("Sample Shows Inserted");

    } catch (err) {
        console.error("Error Seeding Database:", err);
    } finally {
        await closeConnection();
        console.log("MongoDB Connection Closed");
    }
};

seedDB();



