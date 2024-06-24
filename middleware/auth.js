const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//authentication means it verify the token which we had saved in controller (in cookie , and body(user));
exports.auth = async (req, res, next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){                                             //if token missing, then return response
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }

        try{                                                                    //verify the token
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode);
            req.user = decode;
        }
        catch(err) {                       
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

// is MessOwner
exports.isMessOwner = async (req, res, next) => {
    try{
           if(req.user.accountType !== "MessOwner"){        //we had saved accountType in payload in controller(in login when 
                                                           // password is checking) and when we decode token in auth to verify the token
               return res.status(401).json({              // and we done req.user = decode; So accountType is also saved in user 
                   success:false,
                   message:'This is a protected route for MessOwner only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}

// is Client
exports.isClient = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Client"){        //we had saved accountType in payload in controller(in login when password 
                                                        // is checking) and when we decode token in auth to verify the token
               return res.status(401).json({              // and we done req.user = decode; So accountType is also saved in user 
                   success:false,
                   message:'This is a protected route for Client only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }
   
   