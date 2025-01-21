const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const connectionRequestModel = require("../models/connectionRequest");

//request/send/:status/:toUserId
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res)=>{
   
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignored"];

        //only allow this api for status : interested, ignored
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid status type: "+status});
        }

        //check if toUserId exists in DB
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message : "User not found"});
        }

        //check if to and from connection request already exist in the DB
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        });

        if(existingConnectionRequest){
            return res.status(400).json({message : "Already existing connection request"})
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId, toUserId, status,
        });
        const data = await connectionRequest.save();
        res.json({message: "connection request sent", data})
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res)=>{
    //status should be either accepted or rejected
    //requestId should be present inside connectionRequest table
    //the request is sent to toUserId, hence toUserId should be logged in user
    try{
        const {status, requestId} = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status sent"})
        }

        const connectionRequest = await connectionRequestModel.findOne({
            _id: requestId,
            status: "interested",
            toUserId: loggedInUser._id
        });

        if(!connectionRequest){
            return res.status(404).json({message: "Request not found"})
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message: "Connection request "+status, data});
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

module.exports = requestRouter;