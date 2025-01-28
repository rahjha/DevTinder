const expreess = require("express");
const {userAuth} = require("../middleware/auth")
const connectionRequestModel = require("../models/connectionRequest");
const userRouter = expreess.Router();
const User = require("../models/user");

//get all pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{

    //get the requests sent to the logged in user
    //validate that only requests pending for review are returned
    try{
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["_id","firstName", "lastName", "photoUrl", "age", "gender", "about"]);
        
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests,
        });
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

});

userRouter.get("/user/connection", userAuth, async (req, res)=>{
    //connection can be toUserId as well as fromUserId as well provided status is accepted
    //e.g logged in user - Sheetal
    //rahul -> Sheetal (Rahul sent connection request to Sheetal)
    //Sheetal -> Anupam (Sheetal sent connection request to Anupam)
    //Now Sheetal is present in both fromUserId and toUserId as she has two connections which is accepted

    try{
        const loggedInUser = req.user;
        const connectionRequest = await connectionRequestModel.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        }).populate("fromUserId",["_id","firstName", "lastName", "photoUrl", "age", "gender", "about"]).populate("toUserId",["_id","firstName", "lastName","photoUrl", "age", "gender", "about"]);

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});
    }catch(err){
        res.status(400).send("ERROR : ", err.message);
    }
});

userRouter.get("/user/feed", userAuth, async(req, res)=>{
    
    try{
        //user should see all cards except
        //0. his own card
        //1. his connections
        //2. ignored people
        //3. already sent connection request

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;
        const skip = (page-1)*limit;

        const loggedInUser = req.user;

        const connectionRequests = await connectionRequestModel.find({
            $or: [{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}],
        }).select("fromUserId toUserId");

        //get all unique userIds
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select("firstName lastName emailId gender photoUrl age about")
        .skip(skip)
        .limit(limit);

        res.json({users});

    }catch(err){
        res.status(400).json({message: err.message});
    }
});

module.exports = {userRouter};