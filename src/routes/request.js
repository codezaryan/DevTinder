const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Request = require("../models/request");
const user = require("../models/user");
const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:receiverId', userAuth, async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;
        const status = req.params.status

        const allowdStatus = ["pass", "like"];
        if(!allowdStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type: "  + status})
        }

        const existingConnectRequest = await Request.findOne({
            $or: [
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })

        // Mannual code to handle repetetive requests
        if (existingConnectRequest) {
            return res.status(400).json({message: "Request exists already!" })
        }

        const connectionRequest = new Request({
            senderId,
            receiverId,
            status
        })
        
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request sent successfully!",
            data
        })

    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
});
module.exports = requestRouter
