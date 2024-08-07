const express = require('express');
const router = express.Router();
const { userMiddleware } = require("../middleware/isLoggedIn");
const userModel = require("../models/userModel");
const messageModel = require("../models/messageModel");


//route to send message
router.post("/sent/:id",userMiddleware, async (req, res) => {
    try {
      
        let receiver_id=req.params.id;
        let { content } = req.body;
        let { email } = req.user;
        let sender = await userModel.findOne({ email: email});
        let receiver= await userModel.findOne({_id:receiver_id})
        if (sender.friends.includes(receiver_id)) { 
            let message = await messageModel.create({
                sender: sender._id,
                receiver: receiver_id,
                content,
                delete: [sender._id, receiver._id]
            })
            res.status(201).send({ success: true, message: message.content,message_id:message.id });
        }
        else {
            res.status(500).send("Internal Server Error");
        }
    } catch (error) {
        res.status(401).send("Internal Server Error");
    }
})


//router to get specific messages
router.get("/getmessages/:id",userMiddleware,async (req, res) => {
    try {
        let friends_id=req.params.id;
        let { email } = req.user;
        let user = await userModel.findOne({ email: email });
        if(!user) return res.status(401).send("Unauthorized");
        let messages = await messageModel.find({
            $or: [
                { sender: user._id, receiver: friends_id ,senderDeleted:false},
                { sender: friends_id, receiver: user._id,receiverDeleted:false }
            ]
        }).sort({ timestamp: -1 });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send("Not Found")
    }
})


//router for inbox
router.get('/inbox', userMiddleware, async (req, res) => {
    try {
        const { email } = req.user;

        // Find the logged-in user by email and populate their friends
        const user = await userModel.findOne({ email }).populate('friends');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the IDs of the logged-in user's friends
        const friendIds = user.friends.map(friend => friend._id);

        // Find messages where either sender or receiver is in the logged-in user's friends
        const messages = await messageModel.find({
            $or: [
                { sender: { $in: friendIds }, receiver: user._id },
                { receiver: { $in: friendIds }, sender: user._id }
            ]
        }).populate('sender receiver').sort({ createdAt: -1 });

        // Create an array to store unique conversations
        const uniqueConversations = {};

        // Iterate through messages to find unique conversations
        messages.forEach(message => {
            const otherUserId = message.sender._id.equals(user._id) ? message.receiver._id : message.sender._id;

            // Use the other user's ID as the key to ensure uniqueness
            if (!uniqueConversations[otherUserId] || message.createdAt > uniqueConversations[otherUserId].createdAt) {
                uniqueConversations[otherUserId] = message;
            }
        });

        // Convert object values to an array to send as response
        const uniqueMessages = Object.values(uniqueConversations);

        res.status(200).json(uniqueMessages);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//router to delete message

router.get('/delete/:id',userMiddleware, async (req, res) => {
    try {
        let { email } = req.user;
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send("Unauthorized user");

        let message = await messageModel.findOne({ _id: req.params.id });
        if (!message) return res.status(404).send("Message not found");

        if (message.sender.toString() === user._id.toString()) {
            message.senderDeleted = true;
        } else if (message.receiver.toString() === user._id.toString()) {
            message.receiverDeleted = true;
        } else {
            return res.status(403).send("User is not present");
        }

        if (message.senderDeleted && message.receiverDeleted) {
            await messageModel.deleteOne({ _id: message._id });
            return res.status(200).send("Message deleted");
        }

        await message.save();
        res.status(200).send("Deleted");

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;