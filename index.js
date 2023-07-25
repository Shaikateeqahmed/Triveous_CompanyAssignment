const express = require("express");
const {connection} = require("./ConnectionToMongoDB/connection.js");
const { User } = require("./Routes/UserRoute.js");
const { Category } = require("./Routes/CategoryRoute.js");
const { Authenticate } = require("./Middlewares/Authentication.js");
const { Product } = require("./Routes/ProductRoute.js");

const app = express();

app.use(express.json());
app.use("/user",User);
app.use(Authenticate)
app.use("/category",Category);
app.use("/product",Product);

app.listen(3000,async()=>{
    await connection;
    console.log(`Server is Running on a Port 3000`);
})