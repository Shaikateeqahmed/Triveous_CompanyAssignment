const express = require("express");
const {connection} = require("./ConnectionToMongoDB/connection.js");

const app = express();

app.listen(3000,async()=>{
    await connection;
    console.log(`Server is Running on a Port 3000`);
})