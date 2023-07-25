const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    Title : String,
    Price : Number,
    Description : String,
    Availability : String,
    CategoryID : String
})

const ProductModel = mongoose.model("Product",productSchema);

module.exports={ProductModel};