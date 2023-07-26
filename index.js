const express = require("express");
const {connection} = require("./ConnectionToMongoDB/connection.js");
const { User } = require("./Routes/UserRoute.js");
const { Category } = require("./Routes/CategoryRoute.js");
const { Authenticate } = require("./Middlewares/Authentication.js");
const { Product } = require("./Routes/ProductRoute.js");
const { Cart } = require("./Routes/CartRoute.js");
const { Order } = require("./Routes/OrderRoute.js");
require("dotenv").config();
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();

app.use(express.json());

//Configuration of Swagger JSdoc
const options={ 
    definition:{ 
        openapi:"3.0.0", 
        info:{ 
            title:"API Documentation For Your Backend Project.", 
            version:"1.0.0" 
        }, 
        servers:[ 
            { 
                url:"http://localhost:3000" 
            } 
        ] 
    }, 
    apis:["./Routes/*.js"] 
};
 
//OpenAPI Specification
const openAPISpec=swaggerJSdoc(options); 

//Build the SwaggerUI with the help of OpenAPI Spec
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(openAPISpec)); 
 
app.use("/",(req,res)=>{
    res.send("Home page")
})

app.use("/user",User);
app.use(Authenticate)
app.use("/category",Category);
app.use("/product",Product);
app.use("/addtocart",Cart);
app.use("/order",Order);

app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log(`Server is Running on a Port ${process.env.port}`);
    } catch (error) {
        console.log({error:error.message})
    }
   
})