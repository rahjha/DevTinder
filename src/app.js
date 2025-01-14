const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth");

//it is a middleware given by express to convert json to javascript object
app.use(express.json());
app.use(cookieParser());

//signup api
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
        res.send(400, "ERROR: "+err.message)
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

        const isPasswordValid = await user.validatePassword(req.body.password);// this method is defined as helper method in User schema
        if(isPasswordValid){            
            //create a jwt token
            const token = await user.getJWT();// this method is defined as helper method in User schema
            //set the token in cookies and send it to user
            res.cookie("token",token, {expires: new Date(Date.now() + 900000)});
            res.send("Login successfull");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.send(400, "ERROR: "+err.message);
    }
});

//profile api
app.post("/profile",userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

//sendConnectionRequest api
app.post("/sendConnectionRequest", userAuth, (req, res)=>{
    const user = req.user;
    res.send(user.firstName +" sent the connection request..");
});

connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log("Server is listening on port 7777");
    })
}).catch((err)=>{
    console.error("Database cannot be connected");
});