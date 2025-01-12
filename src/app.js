const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

//it is a middleware given by express to convert json to javascript object
app.use(express.json());

//get user by email
app.use("/user", async(req, res)=>{
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
app.use("/feed", async(req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Something went wrong");
    }
})

app.use("/signup", async(req, res)=>{

    const user = new User(req.body);
    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error saving user: "+err.message)
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