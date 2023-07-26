const jwt = require("jsonwebtoken");
require("dotenv").config();

function Authenticate(req, res, next){

    let token = req.headers.authorization;

    //Checking for User having a Token or Not.
    if(token){

        //verifing the Token.
        jwt.verify(token,process.env.key,(error,decode)=>{
            if(error){
                res.status(498).json("Token Expire, Please Login Again!");
            }else{

                // Taking a UserID and UserRole for Authorization and Security Purpose.
                let UserID = decode.UserID;
                let UserRole = decode.UserRole;

                req.body.UserID = UserID;
                req.body.UserRole = UserRole;
                next();
            }
        })
    }else{
        res.status(409).json("Opps!, Its Seems Like You didn't Login. Please Login First!")
    }
}

module.exports={Authenticate};