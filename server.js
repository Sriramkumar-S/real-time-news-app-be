import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { connectToMongoose } from './db-utils/mongoose-connection.js';
import { connectToDB } from './db-utils/mongoDB-connection.js';
import newsRouter from "./routes/news.js";
import subscribeRouter from "./routes/subscribe.js";
// import { SendEmails } from "./utils/sendEmails.js";
import { sendEmails } from "./utils/sendEmails.js";
import { mailFrequency } from './routes/subscribe.js';
import { db } from "./db-utils/mongoDB-connection.js"
import { CronJob } from 'cron';

dotenv.config();

const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
// server.use('/users', userRouter)
server.use('/api/news', newsRouter);
server.use('/api/subscribe',subscribeRouter);

await connectToDB();
await connectToMongoose();

const subscriptionCollection = db.collection('subscriptions');
const subscriptions = await subscriptionCollection.find().toArray();

function triggerEmailToUser(subscriptions) {
    console.log("inside trigger email function")
    if(subscriptions) {
        for(let subscription of subscriptions) {
            const { frequency, email, categories } = subscription;
            let emailFrequency;
             switch(frequency) {
                case 'hourly':
                    const hourlyJob = new CronJob('0 0 * * * *', function() {
                        console.log('This job is triggered every hour!');
                        sendEmails(email, categories);
                      });
                      
                      hourlyJob.start();
                    break;
                case 'daily':
                    const dailyJob = new CronJob('0 0 0 * * *', function() {
                        console.log('This job is triggered every day!'); 
                        sendEmails(email, categories);
                      });
                      
                      dailyJob.start();
                    break;
                case 'weekly':
                    const weeklyJob = new CronJob('0 0 0 * * 0', function() {
                        console.log('This job is triggered every week!'); 
                        sendEmails(email, categories);
                      });
                      
                      weeklyJob.start();
                    break;
                case 'monthly':
                    const monthlyJob = new CronJob('0 0 0 1 * *', function() {
                        console.log('This job is triggered every month!'); 
                        sendEmails(email, categories);
                      });
                      
                      monthlyJob.start();
                    break;
                default:
                    emailFrequency = 24 * 60 * 60 * 1000;
                    break;
            }
        }
    }
}

triggerEmailToUser(subscriptions);

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});
