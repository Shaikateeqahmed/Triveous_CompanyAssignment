const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Modules/UserModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = express.Router();

/** 
 * @swagger 
 * components: 
 *   schemas: 
 *     User: 
 *       type: object 
 *       properties: 
 *         id: 
 *           type: string 
 *           description: The auto-generated id of the user 
 *         Name: 
 *           type: string 
 *           description: The user name 
 *         Email: 
 *           type: string 
 *           description: The user email 
 *         Password: 
 *           type: string 
 *           description: The password of a User
 *         Phone_NO:
 *           type: string
 *           description: The Phone Numbe of a user
 */ 



/**
 * @swagger
 * tags:
 *  name: Users
 *  description: All the API Routes related to Users
 */

/** 
 * @swagger 
 * /user/signup: 
 *   post: 
 *     summary: To Register the details of a new user 
 *     tags: [Users] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/User' 
 *     responses: 
 *       200: 
 *         description: The user was successfully registered 
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/User' 
 *       500: 
 *         description: Some server error 
 */ 
 

User.post("/signup", async (req, res) => {
    const { Name, Email, Password, Phone_NO, Role } = req.body;

    try {
        //checking for All Required Fields.
        if (Name && Email && Password && Phone_NO) {

            let Is_User_Exist = await UserModel.find({ Email });

            //Checking If User Already Exist Or Not. If User Not Exist then Register the New User.
            if (Is_User_Exist.length > 0) {

                res.status(409).json("User With This EmailID Already Exist!");

            } else {

                // Encrypting a Password for Security Purpose.
                bcrypt.hash(Password, 5, async (error, hash) => {
                    if (error) {
                        console.error(error);
                        res.status(500).json("Opps!, Something Went Wrong Please Try Again After SameTime!");
                    } else {

                        // Saving The Data of a User In DataBase.
                        let newUser = new UserModel({ Name, Email, Password: hash, Phone_NO, Role });
                        await newUser.save();
                        res.status(200).json(`Congratulations ${Name}, You Signup Successfully!`);
                    }
                })
            }

        } else {
            res.status(400).json(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`)
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /user/login: 
 *   post: 
 *     summary: To Register the details of a new user 
 *     tags: [Users] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/User' 
 *     responses: 
 *       200: 
 *         description: The user was successfully Login
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/User' 
 *       500: 
 *         description: Some server error 
 */ 

User.post("/login", async (req, res) => {

    let { Email, Password } = req.body;

    try {

        let Is_User_Exist = await UserModel.find({ Email });

        //checking for All Required Fields.
        if (Email && Password) {

            // Checking that User Is Having a Account Already or Not (That is user signup or not)!
            if (Is_User_Exist.length > 0) {

                // Checking for Password is Correct or not at the time of login.
                bcrypt.compare(Password, Is_User_Exist[0].Password, (error, result) => {
                    if (error) {
                        res.status(400).json("Password is Incorrect, Please Check Your Password!");
                    } else {

                        // if User is Already Exist and Password is correct then give a Token to the login user.
                        let token = jwt.sign({ UserID: Is_User_Exist[0]._id, UserRole: Is_User_Exist[0].Role }, process.env.key);
                        res.status(200).json(token);
                    }
                })
            } else {
                res.status(404).json("Opps!, Its Seems Like You didn't Signup. Please Signup First!");
            }

        } else {
            res.status(400).json("Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....")
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

module.exports = { User };