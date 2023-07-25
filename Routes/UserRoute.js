const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../Modules/UserModel.js");

const User = express.Router();

User.post("/signup", async (req, res) => {
    const { Name, Email, Password, Phone_NO } = req.body;


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
                    let newUser = new UserModel({ Name, Email, Password: hash, Phone_NO });
                    await newUser.save();
                    res.send(`Congratulations ${Name}, You Signup Successfully!`);
                }
            })
        }

    } else {
        res.send(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`)
    }
})

module.exports = { User };