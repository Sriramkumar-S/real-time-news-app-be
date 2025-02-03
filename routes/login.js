import express from 'express';
import bcrypt from "bcrypt";
import Subscription from '../db-utils/Subscription.js';
import { db } from "../db-utils/mongoDB-connection.js";
import mongoose from "mongoose";
import { v4 } from 'uuid';

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {

    const userDetails = req.body;
    const loggedInUserCollection = db.collection('users');
    console.log(`Userdetails: ${userDetails}`)
    const user = await loggedInUserCollection.findOne({ email: userDetails.email });
    if (user) {
        alert(`User already exists with ${userdetails.email}`)
        res.status(400).json({ msg: 'User Already Exist' });
    } else {
        bcrypt.hash(userDetails.password, 10, async (err, hash) => {
            try {
                userDetails.password = hash;
                await loggedInUserCollection.insertOne({
                    ...userDetails,
                    id: v4(),
                });

                res.json({ msg: "User created Successfully" });
            } catch (e) {
                if (e instanceof mongoose.Error.ValidationError) {
                    res.status(400).json({ msg: e.message });
                } else {
                    res.status(500).json({ msg: "Internal Server Error", e });
                }
                console.log(e);
            }
        });
    }

})

export default loginRouter;