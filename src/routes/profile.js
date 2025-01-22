const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const {userAuth} = require("../middleware/auth");
const {validateUserUpdateData} = require("../utils/validation")
const User = require("../models/user");


//profile/view api
profileRouter.get("/profile/view",userAuth, async (req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

//profile/edit
profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validateUserUpdateData){
            throw new Error("Invalid field edit request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser});
    }catch(err){
        res.status(400).send("ERROR : ", err.message)
    }
    
})

//profile/password
profileRouter.patch("/profile/password", async(req, res)=>{
    //check email id is present in DB or not, valid user check
    const user = await User.findOne({emailId: req.body.emailId});
    const newPassword = req.body.password;

    //create a hashed password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.save();
    res.send({message : "password updated successfully", data: user});
});

module.exports = profileRouter;