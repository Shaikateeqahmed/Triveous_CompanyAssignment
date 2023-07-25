const express = require("express");
const {connection} = require("./ConnectionToMongoDB/connection.js");
const { User } = require("./Routes/UserRoute.js");
const { Category } = require("./Routes/CategoryRoute.js");
const { Authenticate } = require("./Middlewares/Authentication.js");
const { Product } = require("./Routes/ProductRoute.js");
const { Cart } = require("./Routes/CartRoute.js");
const { Order } = require("./Routes/OrderRoute.js");
require("dotenv").config();


const app = express();

app.use(express.json());
app.use("/user",User);
app.use(Authenticate)
app.use("/category",Category);
app.use("/product",Product);
app.use("/addtocart",Cart);
app.use("/order",Order);

app.listen(process.env.port,async()=>{
    await connection;
    console.log(`Server is Running on a Port ${process.env.port}`);
})