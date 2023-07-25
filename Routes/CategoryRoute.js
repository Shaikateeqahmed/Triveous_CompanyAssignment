const express = require("express");
const {Authorise} = require("../Middlewares/Authorization.js");
const { CategoryModel } = require("../Modules/CategoryModel");
const Category = express.Router();


//Only Admin Can Post or Create A Category.
Category.post("/",Authorise(["Admin"]),async(req,res)=>{
    let {CategoryName, Active} = req.body;
    let Is_Category_Exist = await CategoryModel.find({CategoryName});

    //Checking for the Category is new or Already Exist.
    if(Is_Category_Exist.length>0){
        res.send("Category Already Exist, Please Check It!");
    }else{

        // Saving the Category Data in Database.
        let newCategory = new CategoryModel({CategoryName,Active});
        await newCategory.save();
        res.send(`Hi Admin, New Category ${CategoryName} Added Successfull!`);
    }
})


//Both Admin and Customer can Access the List of a Category.
Category.get("/",Authorise(["Customer","Admin"]),async(req,res)=>{

    let CategoryList = await CategoryModel.find();
    res.send(CategoryList);
})

//Only Admin Can Update the Activess of a Category.
Category.patch("/:id",Authorise(["Admin"]),async(req,res)=>{

    let CategoryID = req.params.id;
    let CategoryByID = await CategoryModel.find({_id:CategoryID});

    //Checking for Category by Given ID is Exist or Not.
    if(CategoryByID.length>0){

        //Updating a data of a category by ID.
        let Update_Activeness = await CategoryModel.findByIdAndUpdate({_id:CategoryID},{Active:!CategoryByID[0].Active});
        res.send(`Category ${CategoryByID[0].CategoryName} is Updated From ${CategoryByID[0].Active} to ${!CategoryByID[0].Active}`);
    }else{
        res.send(`Category With This ID Doesn't Exist!`);
    }
    
})

//Only Admin Can Delete the Category.
Category.delete("/:id",Authorise(["Admin"]),async(req,res)=>{

    let CategoryID = req.params.id;
    let CategoryByID = await CategoryModel.find({_id:CategoryID});

    //Checking for Category by Given ID is Exist or Not.
    if(CategoryByID.length>0){

        //Deleting a data of a category by ID.
        let Deleting_Category = await CategoryModel.findByIdAndDelete({_id:CategoryID});
        res.send(`Category ${CategoryByID[0].CategoryName} is Deleted Successfully!`);
    }else{
        res.send(`Category With This ID Doesn't Exist!`);
    }
    
})

module.exports={Category};