const express = require("express");
const { CartModel } = require("../Modules/CartModel");
const { Authorise } = require("../Middlewares/Authorization");
const { ProductModel } = require("../Modules/ProductModel");

const Cart = express.Router();

/** 
 * @swagger 
 * components: 
 *   schemas: 
 *     Cart : 
 *       type: object 
 *       properties: 
 *         id: 
 *           type: string 
 *           description: The auto-generated id of the user 
 *         ProductID: 
 *           type: string 
 *           description: The ID of a product
 *         CustomerID: 
 *           type: string
 *           description: The ID of a Customer
 *         Quantity: 
 *           type: Number 
 *           description: The Quantity of a product
 *         Total_Price:
 *           type: Number
 *           description: The Total_Price of a product
 */ 

/**
 * @swagger
 * tags:
 *  name: Carts
 *  description: All the API Routes related to Carts
 */

/** 
 * @swagger 
 * /cart: 
 *   get: 
 *     summary: To get the list of all the products in cart
 *     tags: [Carts] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Cart' 
 *     responses: 
 *       200: 
 *         description: The list of all the Products in a cart
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Cart' 
 *       500: 
 *         description: Some server error 
 */ 

//Both Customer And Admin Can Access to they respective Cart Only.
Cart.get("/", async (req, res) => {

    try {
        let CustomerID = req.body.UserID;
        let CartDetailsOfACustomer = await CartModel.find({ CustomerID });
        res.status(200).json(CartDetailsOfACustomer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /cart: 
 *   post: 
 *     summary: To add the new product to cart database
 *     tags: [Carts] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Cart' 
 *     responses: 
 *       200: 
 *         description: The Product was added successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Cart' 
 *       500: 
 *         description: Some server error 
 */ 


//Both Customer And Admin Can Add the Products To the Cart to they respective cart only.
Cart.post("/", Authorise(["Customer", "Admin"]), async (req, res) => {

    let { ProductID, Quantity, Price } = req.body;
    let CustomerID = req.body.UserID;
    let Total_Price = Quantity * Price

    try {
        //checking for All Required Fields.
        if (ProductID && Quantity && Price) {

            //Saving the Cart Details with the Details of Product And Customer in Database.
            let addToCart = new CartModel({ ProductID, CustomerID, Quantity, Total_Price });
            await addToCart.save();
            res.status(200).json(`Quantity:- ${Quantity} of a Product Price:- ${Price} with the Total Price:- ${Total_Price} is Added To Cart Successfully! `);
        } else {
            res.status(400).json(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /cart: 
 *   patch: 
 *     summary: To Update the Quantity of a product
 *     tags: [Carts] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Cart' 
 *     responses: 
 *       200: 
 *         description: The Product was Updated successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Cart' 
 *       500: 
 *         description: Some server error 
 *       409:
  *         description: Product not Exist, Please Check It!
 */      


//Both Customer And Admin Can Update the Quantity of a Cart to they respective cart only.
Cart.patch("/:id", async (req, res) => {
    let cartID = req.params.id;
    let { Quantity } = req.body;

    try {
        //Checking for Quantiy and CartID is Available for update the cart Quatity by the help of cartID.
        if (Quantity && cartID) {
            let CustomerID = req.body.UserID;
            let CustomerID_in_cart = await CartModel.find({ _id: cartID });
            let price_per_unit = (CustomerID_in_cart[0].Total_Price / CustomerID_in_cart[0].Quantity);

            let Total_Price = price_per_unit * Quantity;

            //Checking for User is Authorised to Update a Quantity of a Cart.
            if (CustomerID === CustomerID_in_cart[0].CustomerID) {
                await CartModel.findByIdAndUpdate({ _id: cartID }, { Quantity, Total_Price });
                res.status(200).json(`Quantity of a Cart Changes to ${Quantity}`);
            } else {
                res.status(401).json("You Are Not Authorised To Update a Quantity of a Cart!");
            }

        } else {
            res.status(400).json(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

/** 
 * @swagger 
 * /cart: 
 *   delete: 
 *     summary: To delete the perticular product by it ID
 *     tags: [Carts] 
 *     requestBody: 
 *       required: true 
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: '#/components/schemas/Cart' 
 *     responses: 
 *       200: 
 *         description: The Product was deleted successfully
 *         content: 
 *           application/json: 
 *             schema: 
 *               $ref: '#/components/schemas/Cart' 
 *       500: 
 *         description: Some server error 
 *       409:
 *         description: Product not Exist, Please Check It!
 */ 

//Both Customer And Admin Can Update the Quantity of a Cart to they respective cart only.
Cart.delete("/:id", async (req, res) => {
    let cartID = req.params.id;
    let CustomerID = req.body.UserID;

    try {
        let CustomerID_in_cart = await CartModel.find({ _id: cartID });

        //Checking for User is Authorised to Delete the Item of a Cart.
        if (CustomerID === CustomerID_in_cart[0].CustomerID) {
            await CartModel.findByIdAndDelete({ _id: cartID });
            res.status(200).json(`Item Deleted Successfully from the Cart!`);
        } else {
            res.status(401).json("You Are Not Authorised To Delete a Item of a Cart!");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})



module.exports = { Cart };