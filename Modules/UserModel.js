const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Name : String,
    Email : String,
    Password : String,
    Phone_NO : String
})

const UserModel = mongoose.model("User",userSchema);

module.exports={UserModel};