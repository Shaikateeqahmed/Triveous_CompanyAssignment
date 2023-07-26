const express = require("express");
const { CartModel } = require("../Modules/CartModel.js");
const { OrderModel } = require("../Modules/OrderModel.js");
const Order = express.Router();

//EndPoint For Handle Order Placement, Allowing Users to place an order with Products from their Cart.
Order.get("/:id", async (req, res) => {

    let CartID = req.params.id;

    try {
        let CustomerID = req.body.UserID;
        let Date_Time = new Date();

        //This is for Geting a Year in understandable manner.
        let date = ("0" + Date_Time.getDate()).slice(-2);
        let month = ("0" + (Date_Time.getMonth() + 1)).slice(-2);
        let year = Date_Time.getFullYear();

        let OrderDate = year + "-" + month + "-" + date;

        //This is for Geting a Year in understandable manner.
        let hours = Date_Time.getHours();
        let minutes = Date_Time.getMinutes();
        let seconds = Date_Time.getSeconds();

        let OrderTime = hours + ":" + minutes + ":" + seconds;

        //It is Assume that Product will be Delivering With in 7 Days.
        Date_Time.setDate(Date_Time.getDate() + 7);
        let date_after_7days = ("0" + Date_Time.getDate()).slice(-2);

        let DeliveryDate = "";
        if (date_after_7days < date && month !== 12) {
            let nextmonth = ("0" + (Date_Time.getMonth() + 1)).slice(-2);

            DeliveryDate = year + "-" + nextmonth + "-" + date_after_7days;
        } else if (date_after_7days > date && month !== 12) {
            DeliveryDate = year + "-" + month + "-" + date_after_7days;
        } else if (date_after_7days < date && month === 12) {
            DeliveryDate = year + 1 + "-" + "01" + "-" + date_after_7days;
        }


        let cartDetails = await CartModel.find({ _id: CartID });


        //Checking for is the cart exist or not.
        if (cartDetails.length > 0) {
            let obj = { CustomerID, CartID, OrderDate, OrderTime, DeliveryDate, Total_Order_Amount: cartDetails[0].Total_Price };
            let newOrder = new OrderModel(obj);
            await newOrder.save();

            //Removing the Cart Information from the cart Collection for not appearing again after added to orders.
            await CartModel.findByIdAndDelete({ _id: CartID });
            res.send(`Cart Having ID:- ${CartID} is Added To Orders Successfully!`);
        } else {
            res.send(`Cart With this ID not Exists!`);
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})


//EndPoint for Get the History of orders of a Perticular User Only.
Order.get("/", async (req, res) => {

    try {
        let CustomerID = req.body.UserID;

        let OrderHistoryOfAUser = await OrderModel.find({ CustomerID });

        //Checking for Is User Make Any Order Or not.
        if (OrderHistoryOfAUser.length > 0) {
            res.send({ "Your's Order History": OrderHistoryOfAUser });
        } else {
            res.send("Opps|, You did not Order Anything!")
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})

//EndPoint for get the Details of a Particular Order by the help of OrderID.
Order.get("/orderdetails/:id", async (req, res) => {
    let OrderID = req.params.id;

    try {
        let OrderDetailsOfAParticularOrder = await OrderModel.find({ _id: OrderID });

        //Checking For the Order with the ID is Exist or not
        if (OrderDetailsOfAParticularOrder.length > 0) {
            res.send(OrderDetailsOfAParticularOrder);
        } else {
            res.send(`Order with this Id doesn't Exist!`);
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})

//EndPoint for Deleting of a Particular Order by the help of OrderID.
Order.delete("/:id", async (req, res) => {
    let OrderID = req.params.id;

    try {
        let OrderDetailsOfAParticularOrder = await OrderModel.find({ _id: OrderID });

        //Checking For the Order with the ID is Exist or not
        if (OrderDetailsOfAParticularOrder.length > 0) {

            //Deleting The Order If Exist.
            await OrderModel.findByIdAndDelete({ _id: OrderID });
            res.send(`Order With the ID:- ${OrderID} is deleted Successfully!`);
        } else {
            res.send(`Order with this Id doesn't Exist!`);
        }
    } catch (error) {
        res.send({ error: error.message });
    }

})

module.exports = { Order };