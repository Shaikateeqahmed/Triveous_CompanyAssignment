const express = require("express");
const {Authorise} = require("../Middlewares/Authorization.js");
const Category = express.Router();

Category.get("/",Authorise(["Admin"]),async(req,res)=>{
    res.send("Category Page");
})

module.exports={Category};