const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

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

module.exports = requestRouter;