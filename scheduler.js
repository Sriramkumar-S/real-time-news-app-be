import { sendEmails } from "./utils/sendEmails.js";
import { db } from "./db-utils/mongoDB-connection.js"
import { CronJob } from 'cron';

const subscriptionCollection = db.collection('subscriptions');
const subscriptions = await subscriptionCollection.find().toArray();


if(subscriptions) {
    for(let subscription of subscriptions) {
        const { frequency, email, categories } = subscription;
         switch(frequency) {
            case 'hourly':
                // const hourlyJob = new CronJob('0 0 * * * *', function() {
                    const hourlyJob = new CronJob('0 * * * * *', function() {
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
