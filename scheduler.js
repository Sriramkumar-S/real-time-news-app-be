import { sendEmails } from "./utils/sendEmails.js";
import { CronJob } from 'cron';

let cronExpression = '* * * * * *';
export let cronJob;
export async function scheduleJobs(subscriptions, action) {
    
   subscriptions.forEach(subscription => {
        const { frequency } = subscription;
        if(frequency === 'hourly') {
            cronExpression = '0 0 * * * *';
            // cronExpression = '0 */2 * * * *';
        }else if(frequency === 'daily') {
            cronExpression = '0 0 0 * * *';
            // cronExpression = '0 */5 * * * *';
        }else if(frequency === 'weekly') {
            cronExpression = '0 0 0 * * 0';
        }else if(frequency === 'monthly') {
            cronExpression = '0 0 0 1 * *';
        }else {
            console.log('Invalid frequency');
        }
        cronJob = new CronJob(cronExpression, async () => {
            await sendEmails(subscription.email, subscription.categories);
           });
        cronJob.start();
   });

}