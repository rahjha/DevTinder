const express = require("express");

const app = express();
const {adminAuth,userAuth} = require("../middleware/adminAuth");

//app.use("/user",rh1, rh2, rh3, rh4, rh5)
//app.use("/user",[rh1, rh2, rh3, rh4, rh5])
//app.use("/user",rh1, [rh2, rh3, rh4], rh5)

app.use("/admin", adminAuth);

app.get("/admin/getAllData",(req, res)=>{
    console.log("/admin/getAllData is called");
    res.send("All data is fetched");
})

app.get("/admin/deleteData",(req, res)=>{
    console.log("/admin/deleteData is called");
    res.send("Data is deleted");
})

app.use("/user/data",userAuth, (req, res, next)=>{
    console.log("Handling the route user!!");
    //res.send("1st Response");
    next();
},(req, res)=>{
    console.log("Handling the route user 2!!");
    res.send("2nd Response");
})

app.use("/user/login",(req, res)=>{
    console.log("User login is called");
    res.send("User is logged in")
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
})