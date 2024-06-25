const RatingAndReview = require("../models/RatingAndReview");
const Mess = require("../models/Mess");
const User = require("../models/User");
const { mongo, default: mongoose } = require("mongoose");


//createRating
const createRating = async (req, res) => {
    try{
        const userId = req.user.id;                                                   //get user id        
        // console.log("Request user details",req.users)
        if(!userId)
            {
                return res.status(404).json({
                    status:false,
                    message:"Unable to fetch the user details"
                })
            }
        const {rating, review, foodId} = req.body;                                 //fetchdata from req body
        
        const ownerDetails = await User.findById(userId);
        if(!ownerDetails) {
            return res.status(404).json({
              success: false,
              message: "MessOwner Details Not Found",
            })
          }

        const { firstName, lastName, image,} = ownerDetails;
        const ownerPhoto = `${image}`;
        const ownerName = `${firstName} ${lastName}`;






        // const alreadyReviewed = await RatingAndReview.findOne({user:userId,  mess:foodId,});       //check if user already reviewed the course                                
                                             
        // if(alreadyReviewed) {
        //             return res.status(403).json({
        //                 success:false,
        //                 message:'You have already given the rating',
        //             });
        //         }
        //create an entry for ratingandreview in RatingAndReview folder in DB;
        const ratingReview = await RatingAndReview.create({
                                        rating, 
                                        review, 
                                        mess:foodId,
                                        user:userId,
                                        userName:ownerName,
                                        userProfile:ownerPhoto,
                                    });
       
        //update course with this rating/review
        await Mess.findByIdAndUpdate(foodId,
                                    {
                                        $push: {ratingAndReview: ratingReview._id,}
                                    },
                                    {new: true});

        // await Mess.findByIdAndUpdate( { _id: foodId,},  
        //     {$push: {ratingAndReviews: ratingReview._id,}, },  
        //     {new: true} 
        //     )
    
        return res.status(200).json({                               //return response
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAverageRating
// const getAverageRating = async (req, res) => {
//     try {
//             const Id = req.body.foodId;                             //get course ID
            
//             const result = await RatingAndReview.aggregate([
//                 {
//                     $match:{mess: new mongoose.Types.ObjectId(Id),},        // it find all entry in which id of courses is matched with courseId in RatingAndReview models;
//                 },
//                 {
//                     $group:{ _id:null,  averageRating: { $avg: "$rating"},}         //all entry grouped into single grouped due to (_id:null) and then find averageRating;
//                 }
//             ])

//             if(result.length > 0){                                                   //return rating
//                 return res.status(200).json({
//                     success:true,
//                     averageRating: result[0].averageRating,
//                 })}
 
//             return res.status(200).json({                                          //if no rating/Review exist
//                 success:true,
//                 message:'Average Rating is 0, no ratings given till now',
//                 averageRating:0,
//             })
//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         })
//     }
// }


// get the comment

// const getReviews = async (req,res) =>{

//     try{
        
//         const {foodId} = req.body;
//         console.log(foodId)
       
//         const foodReview = await Mess.findById({foodId}).populate("ratingAndReview");
//         console.log(foodReview)
//         if(!foodReview){

//             return res.status(404).json({

//                 status:false,
//                 message:"Review Not found",
                

//             })
//         }

//         return res.status(200).json({
            
//             status:true,
//             message:"Review Found",
//             data: foodReview,
//         })

//     }
//     catch(err){
        
//         return res.status(500).json({
            
//             success:false,
//             message:err.message,
//         })
//     }
// }

// Get a list of MessFood for a given Owner
const getReviews = async (req, res) => {
    try {
      
      const {foodId} = req.query;                  // Get the owner ID from the authenticated user or request body
      console.log("foodId id is",foodId)


      // Find all reviews belonging to the post
      const messReviews = await RatingAndReview.find({ mess: foodId }).sort({ createdAt: -1 })
      // const ownerMess = await User.find({_id:ownerId}).populate(messes).exec()
      
      if(!messReviews){

        return res.status(404).json({

            status:false,
            message:"Reviews Not found",

        })
    }
      res.status(200).json({                     // Return the owner Food Lists
        success: true,
        data: messReviews,
      })
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Food Post Reviews",
        error: error.message,
      })
    }
  }



module.exports =  {createRating , getAverageRating,getReviews};