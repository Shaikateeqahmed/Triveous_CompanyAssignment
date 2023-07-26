const express = require("express");
const { ProductModel } = require("../Modules/ProductModel");
const { Authorise } = require("../Middlewares/Authorization");

const Product = express.Router();

/** 
 * @swagger 
 * components: 
 *   schemas: 
 *     Product : 
 *       type: object 
 *       properties: 
 *         id: 
 *           type: string 
 *           description: The auto-generated id of the user 
 *         Title: 
 *           type: string 
 *           description: The title of a product
 *         Price: 
 *           type: number
 *           description: The price of a product
 *         Description: 
 *           type: string 
 *           description: The Description of a product
 *         Availability:
 *           type: string
 *           description: The availability of a product
 *         CategoryID:
 *           type: string
 *           description: The CategoryID of a product
 */ 

/**
 * @swagger
 * tags:
 *  name: Products
 *  description: All the API Routes related to Products
 */

/** 
 * @swagger 
 * /product: 
 *   get: 
 *     summary: To get the list of all the products
 *     tags: [Products] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Product' 
 *     responses: 
 *       200: 
 *         description: The list of all the Products
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 */ 


//Both Admin and Customer can Access the List of a Products.
Product.get("/", Authorise(["Customer", "Admin"]), async (req, res) => {

    try {
        let ProductList = await ProductModel.find();
        res.status(200).json(ProductList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /product/:id: 
 *   get: 
 *     summary: To get details of a particular product by its ID
 *     tags: [Products] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Product' 
 *     responses: 
 *       200: 
 *         description: The Details of a Product
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 */ 


//Both Admin and Customer can Access the Details of a Product By ID.
Product.get("/:id", Authorise(["Customer", "Admin"]), async (req, res) => {

    try {
        let ProductID = req.params.id;
        let ProductByID = await ProductModel.find({ _id: ProductID });
        res.status(200).json(ProductByID);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }


})

/** 
 * @swagger 
 * /product: 
 *   post: 
 *     summary: To add the new product to database
 *     tags: [Products] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Product' 
 *     responses: 
 *       200: 
 *         description: The Product was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 */ 


//Only Admin Can Post or Create A Product.
Product.post("/", Authorise(["Admin"]), async (req, res) => {
    let { Title, Price, Description, Availability, CategoryID } = req.body;

    try {
        //checking for All Required Fields.
        if (Title && Price && Description && Availability && CategoryID) {

            // Saving the Product Data in Database.
            let newProduct = new ProductModel({ Title, Price, Description, Availability, CategoryID });
            await newProduct.save();
            res.status(200).json(`Hi Admin, New Product ${Title} Added Successfully!`)
        } else {
            res.status(400).json("Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....")
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /product: 
 *   patch: 
 *     summary: To Update the availability of a product
 *     tags: [Products] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Product' 
 *     responses: 
 *       200: 
 *         description: The Product was Updated successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Product not Exist, Please Check It!
 */ 


//Only Admin Can Update the Availability of a Product.
Product.patch("/:id", Authorise(["Admin"]), async (req, res) => {

    let ProductID = req.params.id;

    try {
        let ProductByID = await ProductModel.find({ _id: ProductID });

        //Checking for Product by Given ID is Exist or Not.
        if (ProductByID.length > 0) {

            //Updating a data of a Product by ID.
            if (ProductByID[0].Availability === "Yes") {
                await ProductModel.findByIdAndUpdate({ _id: ProductID }, { Availability: "No" });
                res.status(200).json(`Product ${ProductByID[0].Title} is Updated Availabiliy From Yes to No.`);
            } else {
                await ProductModel.findByIdAndUpdate({ _id: ProductID }, { Availability: "Yes" });
                res.status(200).json(`Product ${ProductByID[0].Title} is Updated Availabiliy From No to Yes.`);
            }
        } else {
            res.status(409).json(`Product With This ID Doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /product: 
 *   delete: 
 *     summary: To delete the perticular product by it ID
 *     tags: [Products] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Product' 
 *     responses: 
 *       200: 
 *         description: The Product was deleted successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Product not Exist, Please Check It!
 */ 


//Only Admin Can Delete Product.
Product.delete("/:id", Authorise(["Admin"]), async (req, res) => {

    let ProductID = req.params.id;

    try {

        let ProductByID = await ProductModel.find({ _id: ProductID });

        //Checking for Product by Given ID is Exist or Not.
        if (ProductByID.length > 0) {

            //Deleting a data of a Product by ID.
            await ProductModel.findByIdAndDelete({ _id: ProductID });
            res.status(200).json(`Product ${ProductByID[0].Title} is Deleted Successfully!.`);

        } else {
            res.status(409).json(`Product With This ID Doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

module.exports = { Product };