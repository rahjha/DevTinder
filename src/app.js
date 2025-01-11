const express = require("express");

const app = express();

app.get("/hello",(req, res)=>{
    res.send("Hello hello hello")
})

//request params
app.get("/test/:id/:name",(req, res)=>{
    console.log(req.params);
    res.send("Hello from the server");
})

//request query
app.post("/test",(req, res)=>{
    console.log(req.query);
    res.send("Data saved successfully to the database");
})
app.patch("/test",(req,res)=>{
    res.send("Data patched successfully");
})
app.put("/test",(req,res)=>{
    res.send("Data put is successfull");
})
app.delete("/test",(req,res)=>{
    res.send("Data is deleted successfully from the database")
})
app.get("/",(req, res)=>{
    res.send("Namaste Rahul");
})

app.listen(7777,()=>{
    console.log("Server is listening on port 7777");
})