const express = require("express");
const { Authorise } = require("../Middlewares/Authorization.js");
const { CategoryModel } = require("../Modules/CategoryModel");
const Category = express.Router();

/** 
 * @swagger 
 * components: 
 *   schemas: 
 *     Category : 
 *       type: object 
 *       properties: 
 *         id: 
 *           type: string 
 *           description: The auto-generated id of the user 
 *         CategoryName: 
 *           type: string 
 *           description: The Category Name
 *         Active: 
 *           type: boolean
 *           description: The Category is active or not 
 */ 

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: All the API Routes related to Categories
 */

/** 
 * @swagger 
 * /category: 
 *   post: 
 *     summary: To Create the details of a new category 
 *     tags: [Categories] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Category' 
 *     responses: 
 *       200: 
 *         description: The category was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Category' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Category Already Exist, Please Check It!
 */ 

//Only Admin Can Post or Create A Category.
Category.post("/", Authorise(["Admin"]), async (req, res) => {
    let { CategoryName, Active } = req.body;

    try {

        let Is_Category_Exist = await CategoryModel.find({ CategoryName });

        //checking for All Required Fields.
        if (CategoryName && Active) {

            //Checking for the Category is new or Already Exist.
            if (Is_Category_Exist.length > 0) {
                res.status(409).json("Category Already Exist, Please Check It!");
            } else {

                // Saving the Category Data in Database.
                let newCategory = new CategoryModel({ CategoryName, Active });
                await newCategory.save();
                res.status(200).json(`Hi Admin, New Category ${CategoryName} Added Successfull!`);
            }
        } else {
            res.status(400).json("Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....")
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /category: 
 *   get: 
 *     summary: To get the list of all category
 *     tags: [Categories] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Category' 
 *     responses: 
 *       200: 
 *         description: The category was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Category' 
 *       500: 
 *         description: Some server error 
 */ 

//Both Admin and Customer can Access the List of a Category.
Category.get("/", Authorise(["Customer", "Admin"]), async (req, res) => {

    try {
        let CategoryList = await CategoryModel.find();
        res.status(200).json(CategoryList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /category: 
 *   patch: 
 *     summary: To Update the Active status of a category
 *     tags: [Categories] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Category' 
 *     responses: 
 *       200: 
 *         description: The category was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Category' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Category With This ID Doesn't Exist!
 */ 

//Only Admin Can Update the Activess of a Category.
Category.patch("/:id", Authorise(["Admin"]), async (req, res) => {

    try {
        let CategoryID = req.params.id;
        let CategoryByID = await CategoryModel.find({ _id: CategoryID });

        //Checking for Category by Given ID is Exist or Not.
        if (CategoryByID.length > 0) {

            //Updating a data of a category by ID.
            let Update_Activeness = await CategoryModel.findByIdAndUpdate({ _id: CategoryID }, { Active: !CategoryByID[0].Active });
            res.status(200).json(`Category ${CategoryByID[0].CategoryName} is Updated Active Status From ${CategoryByID[0].Active} to ${!CategoryByID[0].Active}`);
        } else {
            res.status(409).json(`Category With This ID Doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /category: 
 *   delete : 
 *     summary: To delete the specific category by its ID 
 *     tags: [Categories] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Category' 
 *     responses: 
 *       200: 
 *         description: The category was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Category' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Category With This ID Doesn't Exist!
 */ 

//Only Admin Can Delete the Category.
Category.delete("/:id", Authorise(["Admin"]), async (req, res) => {

    try {
        let CategoryID = req.params.id;
        let CategoryByID = await CategoryModel.find({ _id: CategoryID });

        //Checking for Category by Given ID is Exist or Not.
        if (CategoryByID.length > 0) {

            //Deleting a data of a category by ID.
            let Deleting_Category = await CategoryModel.findByIdAndDelete({ _id: CategoryID });
            res.status(200).json(`Category ${CategoryByID[0].CategoryName} is Deleted Successfully!`);
        } else {
            res.status(409).json(`Category With This ID Doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

module.exports = { Category };