const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    CategoryName : String,
    Active : Boolean
})

const CategoryModel = mongoose.model("Category",CategorySchema);

module.exports={CategoryModel};