import express from "express";
import { db } from "../db-utils/mongoDB-connection.js";
import { cronJob } from "../scheduler.js"

const unsubscribeRouter = express.Router();

unsubscribeRouter.post("/", async (req, res) => {
  console.log('Inside unSubscribeRouter')
  const { subscribedUser } = req.body;
  const subscriptionCollection = db.collection('subscriptions');

  try {
    const subscription = await subscriptionCollection.findOne({ email: subscribedUser });
    if(subscription) {
        switch (subscription.frequency) {
            case 'hourly':
                cronJob.stop();
                break;
            case 'daily':
               cronJob.stop();
                break;
            case 'weekly':
                cronJob.stop();
                break;
            case 'monthly':
                cronJob.stop();
                break;
            default:
                break;
        }
        await subscriptionCollection.deleteOne({ email: subscribedUser });
        res.status(200).json({ msg: 'Subscription Unsubscribed' })
    }
  } catch (error) {
    res.status(500).json({ message: "Error in Unsubscribing", error: error.message });
  }
});

export default unsubscribeRouter;