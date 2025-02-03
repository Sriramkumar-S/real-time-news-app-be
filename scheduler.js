import { sendEmails } from "./utils/sendEmails.js";
import { CronJob } from 'cron';


let cronExpression = '* * * * * *';
let email = '';
let categories = '';
export let cronJob;
export async function scheduleJobs(subscriptions, action) {
    if(subscriptions.length > 0 && action === 'onLoad') {
      for(let subscription of subscriptions) {
           scheduleFrequency(subscription);
      }
    } else if(subscriptions  && action === 'onSubscription') {
        scheduleFrequency(subscriptions);
    }
}

function scheduleFrequency(subscription) {
    const { frequency } = subscription;
    email = subscription.email;
    categories = subscription.categories;
    if(frequency === 'hourly') {
        // cronExpression = '0 0 * * * *';
        cronExpression = '0 */2 * * * *';
    }else if(frequency === 'daily') {
        cronExpression = '0 0 0 * * *';
    }else if(frequency === 'weekly') {
        cronExpression = '0 0 0 * * 0';
    }else if(frequency === 'monthly') {
        cronExpression = '0 0 0 1 * *';
    }else {
        console.log('Invalid frequency');
    }
    cronJob = new CronJob(cronExpression, async () => {
        await sendEmails(email, categories);
       });
    cronJob.start();
}
