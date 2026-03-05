const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post('/request', userAuth, async (req, res) => {
    const user = req.user;
    console.log(user.firstName + " sending request...");
    res.send(user.firstName + " send request!");
});
module.exports = requestRouter
