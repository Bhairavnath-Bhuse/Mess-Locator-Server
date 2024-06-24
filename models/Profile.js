const mongoose = require("mongoose");

const ProfileSchema = mongoose.Schema({

    contactNumber :{
        type: Number,
        trim: true 
    },

    location :{
        type:String,
        required : true
    },

    about:{
        type: String
    }

})

module.exports = mongoose.model("Profile", ProfileSchema);