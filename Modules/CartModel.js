const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    ProductID : String,
    CustomerID : String,
    Quantity : Number,
    Total_Price : Number
})

const CartModel = mongoose.model("CartItem",CartSchema);

module.exports={CartModel};