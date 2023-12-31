const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    Name : String,
    Email : String,
    Password : String,
    Phone_NO : String,
    Role : {type : String, enum : ["Customer","Admin"], default : "Customer"}
})

const UserModel = mongoose.model("User",userSchema);

module.exports={UserModel};