import express from 'express';
import { db } from '../db-utils/mongoDB-connection.js';

const signoutRouter = express.Router();

signoutRouter.post('/', async (req, res) => {

    const {loggedInUser} = req.body;
    const loggedInUserCollection = db.collection('users');

    try {
        const userDetails = await loggedInUserCollection.findOne({ email: loggedInUser });
        if(userDetails) {
            await loggedInUserCollection.deleteOne({ email: loggedInUser });
            res.json({ msg: 'User logged out successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: "Error in signout", error: error.message });
    }
});

export default signoutRouter;