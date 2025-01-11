// import mongoose from "mongoose";
import { model, Schema } from "mongoose";

const SubscriptionSchema = new Schema({
  email: { type: String, required: true, unique: true },
  categories: { type: String, required: true },
  frequency: { type: String, required: true },
});

const Subscription = new model("Subscription", SubscriptionSchema, "subscriptions");

export default Subscription;
