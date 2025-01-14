import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoose } from './db-utils/mongoose-connection.js';
import { connectToDB } from './db-utils/mongoDB-connection.js';
import newsRouter from "./routes/news.js";
import subscribeRouter from "./routes/subscribe.js";
// import { SendEmails } from "./utils/sendEmails.js";
import './scheduler.js'

dotenv.config();

const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
server.use('/api/news', newsRouter);
server.use('/api/subscribe',subscribeRouter);

await connectToDB();
await connectToMongoose();

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});
