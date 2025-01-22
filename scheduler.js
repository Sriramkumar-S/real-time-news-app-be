import { sendEmails } from "./utils/sendEmails.js";
import { CronJob } from 'cron';

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
    const { frequency, email, categories } = subscription;
           switch(frequency) {
              case 'hourly':
                  // const hourlyJob = new CronJob('0 0 * * * *', function() {
                      const hourlyJob = new CronJob('0 */2 * * * *', function() {
                      console.log('This job is triggered every hour!');
                      sendEmails(email, categories);
                    });
                    
                    hourlyJob.start();
                  break;
              case 'daily':
                //   const dailyJob = new CronJob('0 0 0 * * *', function() {
                    const dailyJob = new CronJob('0 */5 * * * *', function() {
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
                  console.log('No such frequency!');
                  break;
          }
}