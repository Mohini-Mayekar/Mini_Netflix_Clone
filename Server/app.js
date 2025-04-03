import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { createServer } from 'http';
import configRoutes from './routes/index.js';

dotenv.config();
const app = express();
const server = createServer(app);

const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your allowed origins
    methods: ['GET', 'POST'] // Allowed HTTP methods
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});