const express = require("express");
const { CartModel } = require("../Modules/CartModel.js");
const { OrderModel } = require("../Modules/OrderModel.js");
const Order = express.Router();

/** 
 * @swagger 
 * components: 
 *   schemas: 
 *     Order : 
 *       type: object 
 *       properties: 
 *         id: 
 *           type: string 
 *           description: The auto-generated id of the user 
 *         CustomerID: 
 *           type: string 
 *           description: The ID of a Customer
 *         CartID: 
 *           type: string
 *           description: The ID of a Cart
 *         OrderDate: 
 *           type: string 
 *           description: The Date of a Order
 *         OrderTime:
 *           type: string
 *           description: The Time of a order
 *         DeliveryDate:
 *           type: string
 *           description: The Date of a Delivery
 */ 

/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: All the API Routes related to Orders
 */

/** 
 * @swagger 
 * /order/:id: 
 *   get: 
 *     summary: To place an order from the cart
 *     tags: [Orders] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Order' 
 *     responses: 
 *       200: 
 *         description: The order placed successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Order' 
 *       500: 
 *         description: Some server error 
 */ 

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
            res.status(200).json(`Cart Having ID:- ${CartID} is Added To Orders Successfully!`);
        } else {
            res.status(409).json(`Cart With this ID not Exists!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /order: 
 *   get: 
 *     summary: To get the history of all the orders
 *     tags: [Orders] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Orders' 
 *     responses: 
 *       200: 
 *         description: The list of all the Orders
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Product' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Product not Exist, Please Check It!
 */ 

//EndPoint for Get the History of orders of a Perticular User Only.
Order.get("/", async (req, res) => {

    try {
        let CustomerID = req.body.UserID;

        let OrderHistoryOfAUser = await OrderModel.find({ CustomerID });

        //Checking for Is User Make Any Order Or not.
        if (OrderHistoryOfAUser.length > 0) {
            res.status(200).json({ "Your's Order History": OrderHistoryOfAUser });
        } else {
            res.status(409).json("Opps|, You did not Order Anything!")
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /order/orderdetails/:id: 
 *   get: 
 *     summary: To get Details of a perticular order
 *     tags: [Orders] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Order' 
 *     responses: 
 *       200: 
 *         description: The Details of a perticular order
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/order' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Order not Exist, Please Check It!
 */ 

//EndPoint for get the Details of a Particular Order by the help of OrderID.
Order.get("/orderdetails/:id", async (req, res) => {
    let OrderID = req.params.id;

    try {
        let OrderDetailsOfAParticularOrder = await OrderModel.find({ _id: OrderID });

        //Checking For the Order with the ID is Exist or not
        if (OrderDetailsOfAParticularOrder.length > 0) {
            res.status(200).json(OrderDetailsOfAParticularOrder);
        } else {
            res.status(409).json(`Order with this Id doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /order: 
 *   delete: 
 *     summary: To delete the order
 *     tags: [Orders] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Order' 
 *     responses: 
 *       200: 
 *         description: The Orders was Deleted successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Order' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Order not Exist, Please Check It!
 */ 


//EndPoint for Deleting of a Particular Order by the help of OrderID.
Order.delete("/:id", async (req, res) => {
    let OrderID = req.params.id;

    try {
        let OrderDetailsOfAParticularOrder = await OrderModel.find({ _id: OrderID });

        //Checking For the Order with the ID is Exist or not
        if (OrderDetailsOfAParticularOrder.length > 0) {

            //Deleting The Order If Exist.
            await OrderModel.findByIdAndDelete({ _id: OrderID });
            res.status(200).json(`Order With the ID:- ${OrderID} is deleted Successfully!`);
        } else {
            res.status(409).json(`Order with this Id doesn't Exist!`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

module.exports = { Order };