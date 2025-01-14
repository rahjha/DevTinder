const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next)=>{
    try{
        //Read the token from the req cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid..");
        }
        //validate the token
        const decodeObj = await jwt.verify(token, "SheetalRahul@19924");
        const {_id} = decodeObj;
        //find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found..");
        }
        req.user = user;
        next();
    }catch(err){
        res.send(400, err.message);
    }
}

module.exports = {
    userAuth,
};