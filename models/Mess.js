const mongoose = require("mongoose")

const messSchema = mongoose.Schema({

    bhaji:{
        type:String,
        required:true
    },

    about:{
        type:String
    },
    
    description:{
        type:String
    },
    owner_name:{
        type:String,
    },
    
    owner_photo:{
        type:String,
    },

    price:{
        type:Number,
        required: true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    area:{
        type:String,
        required : true
    },

    location:{
        type: String,
		enum: ["Pimpri-Chinchwad", "Pune","Hinjewadi"],
		required: true,
    },

    ratingAndReview :[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
        }
    ],

    date:{
        type:Date,
        required:true
    },

    thumbnailImage:{
        type:String
    },

    // clientEnroll:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:"User"
    //     }
    // ]
    
})

module.exports = mongoose.model("Mess",messSchema);