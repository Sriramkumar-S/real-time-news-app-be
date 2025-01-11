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
    if(subscriptions) {
        for(let subscription of subscriptions) {
            const { frequency, email, categories } = subscription;
            let emailFrequency;
             switch(frequency) {
                case 'hourly':
                    // emailFrequency = 60 * 60 * 1000;
                    // emailFrequency = 1 * 60 * 1000;
                    const hourlyJob = new CronJob('0 * * * * *', function() {
                        console.log('This job is triggered every minute!');
                        sendEmails(email, categories);
                      });
                      
                      hourlyJob.start();
                    break;
                case 'daily':
                    // emailFrequency = 24 * 60 * 60 * 1000;
                    // emailFrequency = 2 * 60 * 1000;
                    const dailyJob = new CronJob('0 */3 * * * *', function() {
                        console.log('This job is triggered every 3 minutes!'); 
                        sendEmails(email, categories);
                      });
                      
                      dailyJob.start();
                    break;
                case 'weekly':
                    // emailFrequency = 7 * 24 * 60 * 60 * 1000;
                    // emailFrequency = 3 * 60 * 1000;
                    const weeklyJob = new CronJob('0 */5 * * * *', function() {
                        console.log('This job is triggered every 5 minutes!'); 
                        sendEmails(email, categories);
                      });
                      
                      weeklyJob.start();
                    break;
                case 'monthly':
                    // emailFrequency = 30 * 7 * 24 * 60 * 60 * 1000;
                    // emailFrequency = 4 * 60 * 1000;
                    const monthlyJob = new CronJob('0 */7 * * * *', function() {
                        console.log('This job is triggered every 7 minutes!'); 
                        sendEmails(email, categories);
                      });
                      
                      monthlyJob.start();
                    break;
                default:
                    emailFrequency = 24 * 60 * 60 * 1000;
                    break;
            }
            // setInterval(() => {
            //     sendEmails(email, categories);
            // }, emailFrequency)
        }
    }
}

// if(subscriptions) {
//     subscriptions.forEach(subscription => {
//         let emailFrequency;
//         if(subscription.frequency === 'hourly') {
//             emailFrequency = 60 * 60 * 24;
//         }else if(subscription.frequency === 'daily') {
//             emailFrequency = 24 * 60 * 60 * 1000;
//         }else if(subscription.frequency === 'weekly') {
//             emailFrequency = 7 * 24 * 60 * 60 * 1000;
//         }else if(subscription.frequency === 'monthly') {
//             emailFrequency = 30 * 7 * 24 * 60 * 60 * 1000;
//         }
//     })
// }



// setInterval(() => {
//     console.log(mailFrequency);
//     console.log(subscriptions);
//     sendEmails();
// }, 3 * 60 * 1000);

triggerEmailToUser(subscriptions);

server.listen(PORT, () => {
    console.log("Server listening on ", PORT);
});

//

