const express = require("express");

const app = express();

app.use("/hello",(req, res)=>{
    res.send("Hello hello hello")
})
app.use("/test",(req, res)=>{
    res.send("Hello from the server");
})

app.use("/",(req, res)=>{
    res.send("Namaste Rahul");
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
})