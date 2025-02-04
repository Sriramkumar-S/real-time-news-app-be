import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoose } from './db-utils/mongoose-connection.js';
import { connectToDB } from './db-utils/mongoDB-connection.js';
import newsRouter from "./routes/news.js";
import subscribeRouter from "./routes/subscribe.js";
import { scheduleJobs } from './scheduler.js';
import { db } from "./db-utils/mongoDB-connection.js"
import loginRouter from './routes/login.js';
import unsubscribeRouter from './routes/unsubscribe.js';
import signoutRouter from './routes/signout.js';

dotenv.config();

const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
server.use('/api/news', newsRouter);
server.use('/api/subscribe',subscribeRouter);
server.use('/api/signup', loginRouter);
server.use('/api/unsubscribe', unsubscribeRouter);
server.use('/api/signout', signoutRouter);

await connectToDB();
await connectToMongoose();

const subscriptionCollection = db.collection('subscriptions');
const subscriptions = await subscriptionCollection.find().toArray();
scheduleJobs(subscriptions, 'onLoad');

setInterval(() => {
    console.log('Triggering every five minutes');
}, 5 * 60 * 1000)

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});
