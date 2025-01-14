const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

//it is a middleware given by express to convert json to javascript object
app.use(express.json());
app.use(cookieParser());

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
    
});

//get all user for feed api
app.get("/feed", async(req, res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Something went wrong");
    }
});

app.post("/signup", async(req, res)=>{
    console.log("signup api is called");
    try{
        validateSignUpData(req);    
        //Encrypt the password using npm bcrypt module
        const {firstName, lastName, emailId, password, age, gender} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
            age,
            gender
        });
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
});

//delete api
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("something went wrong")
    }
});

//update by userId using patch
app.patch("/user/:userId", async(req, res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    console.log("userId", userId);
    try{
        const ALLOWED_FIELD_UPDATE = ["photoUrl","about","gender","age","skills"];
        const isUpdateAllowed = Object.keys(data).every((k)=>ALLOWED_FIELD_UPDATE.includes(k));
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
});

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
});

//login api
app.post("/login", async(req, res)=>{
    //first check the emailId is present, if present then compare the password
    try{
        const{emailId, password} = req.body;

        const user = await User.findOne({emailId : emailId})

        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){            
            //create a jwt token
            const token = jwt.sign({_id: user._id},"SheetalRahul@19924");
            console.log(token);
            //set the token in cookies and send it to user
            res.cookie("token",token);
            res.send("Login successfull");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
});

//profile api
app.post("/profile", async(req, res)=>{
    try{
        //get the cookie from request and validate the cookie - this is done using jsonwebtoken npm package
        //once the cookie is validate, then return the response, else return error response
        const cookie = req.cookies;
        const {token} = cookie;
        if(!token){
            throw new Error("Invalid token");
        }
        const decodedMessage = await jwt.verify(token, "SheetalRahul@19924")
        const {_id} = decodedMessage;
        
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User doesn't exist");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777");
    })
}).catch((err)=>{
    console.error("Database cannot be connected");
});