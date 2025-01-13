const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

//it is a middleware given by express to convert json to javascript object
app.use(express.json());

//get user by email
app.get("/user", async(req, res)=>{
    const emailId = req.body.emailId;
    try{
        const users = await User.find({emailId: emailId});
        if(users.length===0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    }catch(err){
        res.status(500).send("Something went wrong");
    }
    
})

//get all user for feed api
app.get("/feed", async(req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Something went wrong");
    }
})

app.post("/signup", async(req, res)=>{

    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error saving user: "+err.message)
    }
})

//delete api
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("something went wrong")
    }
})

//update by userId using patch
app.patch("/user/:userId", async(req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    console.log("userId", userId);
    try{
        const ALLOWED_FIELD_UPDATE = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_FIELD_UPDATE.includes(k));
        console.log("isUpdateAllowed: ", isUpdateAllowed);
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("There cannot be mroe than 10 skills");
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data, {returnDocument:"before"}, {runValidators:"true"});
        res.send(user);
    }catch(err){
        res.status(500).send(err.message);
    }
})

//find by emailId and update using patch
app.patch("/userUpdateByEmail", async(req, res)=>{
    const emailId = req.body.emailId;
    const data = req.body;

    try{
        const user = await User.findOneAndUpdate({emailId: emailId}, data, {returnDocument:"after"});
        res.send(user);
    }catch(err){
        res.status(500).send("something went wrong");
    }
})

connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777");
    })
}).catch((err)=>{
    console.error("Database cannot be connected");
});