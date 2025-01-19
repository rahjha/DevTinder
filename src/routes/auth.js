const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const validateSignUpData = require("../utils/validation");
const User = require("../models/user");

//signup api
authRouter.post("/signup", async(req, res)=>{
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
authRouter.post("/login", async(req, res)=>{
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

//logout api
authRouter.post("/logout",async(req, res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    });
    res.send("user is logged out");
});

module.exports = authRouter;