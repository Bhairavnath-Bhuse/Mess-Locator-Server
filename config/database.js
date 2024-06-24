const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
            ssl: true, // to encrypt the communication between the client and the server.
        
        }
    ).then( () =>{
        console.log("DB Connected Sucuessfully")
    })
    .catch((err) =>{
            console.log("Error Occur while Connecting to Database");
            console.log(err);
            process.exit(1);
    })
}