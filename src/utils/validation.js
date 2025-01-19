const validator = require("validator");

const validateSignUpData = (req)=>{

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("EmailId is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password");
    }
};

const validateUserUpdateData = (req)=>{
    const allowedEditField = ["firstName","lastName","emailId","age","gender","photoUrl","about","skills"];

    const isUpdateAllowed = Object.keys(req.body).every((field)=>{
        allowedEditField.includes(field);
    });
};

module.exports = {validateSignUpData, validateUserUpdateData};