const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Modules/UserModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = express.Router();

User.post("/signup", async (req, res) => {
    const { Name, Email, Password, Phone_NO, Role } = req.body;

    try {
        //checking for All Required Fields.
        if (Name && Email && Password && Phone_NO) {

            let Is_User_Exist = await UserModel.find({ Email });

            //Checking If User Already Exist Or Not. If User Not Exist then Register the New User.
            if (Is_User_Exist.length > 0) {

                res.send("User With This EmailID Already Exist!");

            } else {

                // Encrypting a Password for Security Purpose.
                bcrypt.hash(Password, 5, async (error, hash) => {
                    if (error) {
                        console.error(error);
                        res.send("Opps!, Something Went Wrong Please Try Can After SameTime!");
                    } else {

                        // Saving The Data of a User In DataBase.
                        let newUser = new UserModel({ Name, Email, Password: hash, Phone_NO, Role });
                        await newUser.save();
                        res.send(`Congratulations ${Name}, You Signup Successfully!`);
                    }
                })
            }

        } else {
            res.send(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`)
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})

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
                        res.send("Password is Incorrect, Please Check Your Password!");
                    } else {

                        // if User is Already Exist and Password is correct then give a Token to the login user.
                        let token = jwt.sign({ UserID: Is_User_Exist[0]._id, UserRole: Is_User_Exist[0].Role }, process.env.key);
                        res.send(token);
                    }
                })
            } else {
                res.send("Opps!, Its Seems Like You didn't Signup. Please Signup First!");
            }

        } else {
            res.send("Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....")
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})

module.exports = { User };