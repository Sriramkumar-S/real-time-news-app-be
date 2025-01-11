import express from "express";
import Subscription from "../db-utils/Subscription.js";
import transporter from "../utils/mailer.js";
import { db } from "../db-utils/mongoDB-connection.js";
import { v4 } from "uuid";

const subscribeRouter = express.Router();
export let mailFrequency = 'daily';

subscribeRouter.post("/", async (req, res) => {
  const { email, categories, frequency } = req.body;
  const subscriptionDetails = req.body;
  const subscriptionCollection = db.collection('subscriptions');

  try {
    const subscription = await subscriptionCollection.findOne({ email: subscriptionDetails.email });
    if(subscription) {
        res.status(400).json({ msg: 'Subscription Already Exist' })
    } else {

        const subscriptionObj = new Subscription({
            ...subscriptionDetails,
        });
        await subscriptionObj.validate();
        // const subscription = new Subscription({ email, categories, frequency });
        // await subscription.save();
        await subscriptionCollection.insertOne({
            ...subscriptionDetails,
            id: v4()
        });

        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Subscription Confirmation",
        html: `<h3>Thank you for subscribing!</h3>
                <p>You've subscribed to the following category: ${categories}</p>
                <p>Frequency: ${frequency}</p>`,
        };

        mailFrequency = frequency;

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Subscription successful" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Subscription failed", error: error.message });
  }
});

export default subscribeRouter;
// export { mailFrequency };

