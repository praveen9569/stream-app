import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import mongoose from 'mongoose';







export async function getrecommendedUsers(req,res)
{
    try {

        const curretnUserId = req.user.id;
        const curretnUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: curretnUserId } }, // Exclude current user
                { _id: { $nin: curretnUser.friends } }, // Exclude friends
                {isOnboarded: true} // Only include users who are onboarded
            ]
        }).limit(10); // Limit to 10 recommended users  
        res.status(200).json(recommendedUsers);
        
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

}


export async function getMyFriends(req,res)
{

    try {
        const user = await User.findById(req.user.id).select('friends').populate('friends', 'fullname profilePic nativeLanguage leraningLanguage'); // Populate friends with specific fields

        res.status(200).json(user.friends);
        
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }

}

export async function sendFriendRequest(req, res) {
    try {

        const myId = req.user.id;
        const {id:recipientId} = req.params ;
        //prevent sending req to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }
        // Check if a user  already friends with the recipient
       if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user." });
        }

        // Check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }
        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json({
            message: "Friend request sent successfully.",
            friendRequest
        });

        
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: requestId } = req.params;

        // Find the friend request
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        // Check if the current user is the recipient of the request
        if (friendRequest.recipient.toString() !== myId) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request." });
        }

        // Update the status of the friend request to 'accepted'
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add each other to friends list
        const senderId = friendRequest.sender;
        await User.findByIdAndUpdate(myId, { $addToSet: { friends: senderId } });
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: myId } });

        res.status(200).json({ message: "Friend request accepted successfully." });
        
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getFriendRequests(req, res) {
    try {
       
        const incomingReq = await FriendRequest.find({ recipient: req.user.id, status: 'pending' })
            .populate('sender', 'fullname profilePic nativeLanguage leraningLanguage');
        const acceptedReq = await FriendRequest.find({ sender: req.user.id, status: 'accepted' })
            .populate('recipient', 'fullname profilePic nativeLanguage leraningLanguage');
        res.status(200).json({
            incoming: incomingReq,  
            outgoing: outgoingReq
        });


    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingReq = await FriendRequest.find({ sender: req.user.id, status: 'pending' })
            .populate('recipient', 'fullname profilePic nativeLanguage leraningLanguage');
        res.status(200).json(outgoingReq);
        
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}   