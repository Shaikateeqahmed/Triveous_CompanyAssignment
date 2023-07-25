const express = require("express");
const { CartModel } = require("../Modules/CartModel");
const { Authorise } = require("../Middlewares/Authorization");
const { ProductModel } = require("../Modules/ProductModel");

const Cart = express.Router();


//Both Customer And Admin Can Access they Cart Only.
Cart.get("/", async (req, res) => {
    let CustomerID = req.body.UserID;
    let CartDetailsOfACustomer = await CartModel.find({ CustomerID });
    res.send(CartDetailsOfACustomer);
})


//Both Customer And Admin Can Add the Products To the Cart to they respective cart only.
Cart.post("/", Authorise(["Customer", "Admin"]), async (req, res) => {

    let { ProductID, Quantity, Price } = req.body;
    let CustomerID = req.body.UserID;
    let Total_Price = Quantity * Price

    //checking for All Required Fields.
    if (ProductID && Quantity && Price){

        //Saving the Cart Details with the Details of Product And Customer in Database.
        let addToCart = new CartModel({ ProductID, CustomerID, Quantity, Total_Price });
        await addToCart.save();
        res.send(`Quantity:- ${Quantity} of a Product Price:- ${Price} with the Total Price:- ${Total_Price} is Added To Cart Successfully! `);
    } else {
        res.send(`Opps!, Its Seems Like You Don't Provide All The Required Fields!. Please Fill All The Fields....`);
    }


})


//Both Customer And Admin Can Update the Quantity of a Cart to they respective cart only.
Cart.patch("/:id",async(req,res)=>{
    let cartID = req.params.id;
    let {Quantity} = req.body;
    let CustomerID = req.body.UserID;
    let CustomerID_in_cart = await CartModel.find({_id:cartID});
    let price_per_unit = (CustomerID_in_cart[0].Total_Price/CustomerID_in_cart[0].Quantity);

    let Total_Price = price_per_unit*Quantity;

    //Checking for User is Authorised to Update a Quantity of a Cart.
    if(CustomerID===CustomerID_in_cart[0].CustomerID){
        await CartModel.findByIdAndUpdate({_id:cartID},{Quantity,Total_Price});
        res.send(`Quantity of a Cart Changes to ${Quantity}`);
    }else{
        res.send("You Are Not Authorised To Update a Quantity of a Cart!");
    }
    

})

//Both Customer And Admin Can Update the Quantity of a Cart to they respective cart only.
Cart.delete("/:id",async(req,res)=>{
    let cartID = req.params.id;
    let CustomerID = req.body.UserID;
    let CustomerID_in_cart = await CartModel.find({_id:cartID});
    
    //Checking for User is Authorised to Delete the Item of a Cart.
    if(CustomerID===CustomerID_in_cart[0].CustomerID){
        await CartModel.findByIdAndDelete({_id:cartID});
        res.send(`Item Deleted Successfully from the Cart!`);
    }else{
        res.send("You Are Not Authorised To Delete a Item of a Cart!");
    }
    

})



module.exports = { Cart };