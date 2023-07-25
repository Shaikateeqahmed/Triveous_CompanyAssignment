const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    CustomerID : String,
    CartID : String,
    OrderDate : String,
    OrderTime : String,
    DeliveryDate : String,
    Total_Order_Amount : Number
})

const OrderModel = mongoose.model("order",OrderSchema);

module.exports={OrderModel};