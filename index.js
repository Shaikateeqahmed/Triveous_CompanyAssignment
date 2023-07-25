const express = require("express");
const {connection} = require("./ConnectionToMongoDB/connection.js");
const { User } = require("./Routes/UserRoute.js");

const app = express();

app.use(express.json());
app.use("/user",User);

app.listen(3000,async()=>{
    await connection;
    console.log(`Server is Running on a Port 3000`);
})