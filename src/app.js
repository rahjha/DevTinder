const express = require("express");
const app = express();

app.use("/user",(req, res)=>{
    
    try{
        throw new Error("Customer error");
    }catch{
        next();
    }
});

app.use("/user",(err, req, res, next)=>{
    res.status(500).send("something went wrong");
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
})