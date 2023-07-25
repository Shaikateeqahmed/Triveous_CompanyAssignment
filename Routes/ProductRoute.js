const express = require("express");
const { ProductModel } = require("../Modules/ProductModel");
const { Authorise } = require("../Middlewares/Authorization");

const Product = express.Router();

//Both Admin and Customer can Access the List of a Products.
Product.get("/", Authorise(["Customer", "Admin"]), async (req, res) => {

    let ProductList = await ProductModel.find();
    res.send(ProductList);
})

//Both Admin and Customer can Access the Details of a Product By ID.
Product.get("/:id", Authorise(["Customer", "Admin"]), async (req, res) => {

    let ProductID = req.params.id;
    let ProductByID = await ProductModel.find({ _id: ProductID });
    res.send(ProductByID);
    
})

//Only Admin Can Post or Create A Product.
Product.post("/", Authorise(["Admin"]), async (req, res) => {
    let { Title, Price, Description, Availability, CategoryID } = req.body;


    //checking for All Required Fields.
    if (Title && Price && Description && Availability && CategoryID) {

        // Saving the Product Data in Database.
        let newProduct = new ProductModel({ Title, Price, Description, Availability, CategoryID });
        await newProduct.save();
        res.send(`Hi Admin, New Product ${Title} Added Successfully!`)
    } else {
        res.send("Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....")
    }
})

//Only Admin Can Update the Availability of a Product.
Product.patch("/:id", Authorise(["Admin"]), async (req, res) => {

    let ProductID = req.params.id;

    let ProductByID = await ProductModel.find({ _id: ProductID });

    //Checking for Product by Given ID is Exist or Not.
    if (ProductByID.length > 0) {

        //Updating a data of a Product by ID.
        if (ProductByID[0].Availability === "Yes") {
            await ProductModel.findByIdAndUpdate({ _id: ProductID }, { Availability: "No" });
            res.send(`Product ${ProductByID[0].Title} is Updated Availabiliy From Yes to No.`);
        } else {
            await ProductModel.findByIdAndUpdate({ _id: ProductID }, { Availability: "Yes" });
            res.send(`Product ${ProductByID[0].Title} is Updated Availabiliy From No to Yes.`);
        }
    } else {
        res.send(`Product With This ID Doesn't Exist!`);
    }
})

//Only Admin Can Delete Product.
Product.delete("/:id", Authorise(["Admin"]), async (req, res) => {

    let ProductID = req.params.id;

    let ProductByID = await ProductModel.find({ _id: ProductID });

    //Checking for Product by Given ID is Exist or Not.
    if (ProductByID.length > 0) {

        //Deleting a data of a Product by ID.
        await ProductModel.findByIdAndDelete({ _id: ProductID });
        res.send(`Product ${ProductByID[0].Title} is Deleted Successfully!.`);

    } else {
        res.send(`Product With This ID Doesn't Exist!`);
    }
})

module.exports = { Product };