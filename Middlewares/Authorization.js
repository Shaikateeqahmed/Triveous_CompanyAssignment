function Authorise(Role_Array){

    // returning a Middleware which check the Role of the user then give the access.
      return (req,res,next)=>{
        const UserRole = req.body.UserRole;

        //Checking for the User is Authorised or not.
        if(Role_Array.includes(UserRole)){
            next();
        }else{
            res.status(401).json("Sorry!, You Are Not Authorised!");
        }
      }
}

module.exports={Authorise};