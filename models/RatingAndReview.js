const mongoose = require("mongoose")

const RrSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    userName:{
        type:String
    },

    userProfile :{
        type:String
    },

    review:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
    },
    mess: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Mess",
		index: true,
	},
    

})

module.exports = mongoose.model("RatingAndReview",RrSchema)