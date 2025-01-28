const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required:true,
        minLength:4,
        maxLength:50,
        index:true,
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please pass a valid Email")
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password")
            }
        }
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("gender is not valid")
            }
        }
    },
    photoUrl:{
        type: String,
        //validate(value){
        //    if(!validator.isURL(value)){
        //        throw new Error("invalid photoUrl")
        //    }
        //}
    },
    about:{
        type: String,
        default: "This is default about of the user"
    },
    skills:{
        type:[String]
    }
    },
    {
        timestamps: true,
    }
)

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"SheetalRahul@19924", { expiresIn: "1d" });
    return token;
};

userSchema.methods.validatePassword = async function(passwordUserInput){
    const user = this;
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordUserInput, hashedPassword);
    return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = User;