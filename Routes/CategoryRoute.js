const express = require("express");

const Category = express.Router();

Category.get("/",async(req,res)=>{
    res.send("Category Page");
})

module.exports={Category};