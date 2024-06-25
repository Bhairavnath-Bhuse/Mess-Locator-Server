const User = require("../models/User");
const Mess = require("../models/Mess");
// const Location = require("../models/Location")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// Function to create a new Mess

function isFileTypeSupported(fileType, supportedTypes) {
  return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  if (quality) {
      options.quality = quality;
  }
  options.resource_type = "auto"
  
  try {
      const response = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "BlogApp",
          quality: 300,
          options,
          timeout: 120000 
      });
              
      return response;
  } catch (error) {
      if (error && error.http_code === 499) {
          console.error('Cloudinary request timed out:', error.message);
          // Handle timeout error, retry or return an appropriate response
      } else {
          console.error('Error uploading to Cloudinary:', error.message);
          // Handle other errors
      }
      throw error;
  }
}


exports.createFoodPost = async (req, res) => {
    try {
      const userId = req.user.id
      let {bhaji,about,description,price,owner,location,date,area} = req.body;
    
      const thumbnail = req.files.thumbnailImage                         // Get thumbnail image from request files
  
      const supportedTypes = ["png", "jpg", "jpeg"];
      const fileType = thumbnail.name.split('.')[1].toLowerCase();

        // Check file type is supported or not 
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported"
            })
        }



    //   const tag = JSON.parse(_tag)                                    //Convert the tag and instructions from stringified Array to Array
    //   const instructions = JSON.parse(_instructions)
  
      // Check if any of the required fields are missing
      if(!bhaji || !about || !price || !owner ||  !location ||  !thumbnail || !area) {
            return res.status(400).json({success: false, message: "All Fields are Mandatory", })
         }
      

      // Check if the user is an instructor
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


      // Upload the Thumbnail to Cloudinary
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME,300 )
      
      // Create a new course with the given details in DB;
      const newMess = await Mess.create({
           bhaji,
           about,
           description,
           price,
           owner,
           owner_photo:ownerPhoto,
           owner_name:ownerName,
           location,
           date ,
           area,
           thumbnailImage:thumbnailImage.secure_url
          })
  
      // Add the new course to the User Schema of the Instructor
      await User.findByIdAndUpdate( { _id: ownerDetails._id,},  
        {$push: 
            {messes: newMess._id,},
        },  
            {new: true} 
        )
       
      // Add the new course to the Categories
    //   const categoryDetails2 = await Category.Location( { _id: category },  
    //     {$push: {messes: newMess._id,},},
    //     { new: true } )
        
      res.status(200).json({                                      // Return the new course and a success message
        success: true,
        data: newMess,
        message: "Food Post Created Successfully",
      })
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create Food Post",
        error: error.message,
      })
    }
  }


// Get Mess List
exports.getAllFoodPost = async (req, res) => {
    try {
      const allMess = await Mess.find()
                         .populate("owner").exec()
  
      return res.status(200).json({
        success: true,
        data: allMess,
      })
    } 
    catch(error){
      return res.status(404).json({
        success: false,
        message: `Can't Fetch Course Data`,
        error: error.message,
      })
    }
  }


// Get a list of MessFood for a given Owner
  exports.getOwnerMessFoodPost = async (req, res) => {
    try {
      
      const {ownerId} = req.query;                  // Get the owner ID from the authenticated user or request body
      // console.log("owner id is",ownerId)


      // Find all foods belonging to the owner
      const ownerMess = await Mess.find({ owner: ownerId }).sort({ createdAt: -1 })
      // const ownerMess = await User.find({_id:ownerId}).populate(messes).exec()
      
      if(!ownerMess){

        return res.status(404).json({

            status:false,
            message:"Post Not found",

        })
    }
      res.status(200).json({                     // Return the owner Food Lists
        success: true,
        data: ownerMess,
      })
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve Owner Food Post",
        error: error.message,
      })
    }
  }



// Update the Food Posts
exports.updateFoodPost = async (req, res) => {
  try {
    const { foodId, bhaji, about, price, area, description, location, date } = req.body;
    // console.log("Food id in Mess is", foodId);
    // console.log("Data before ", foodId, bhaji, about, description, price, area);

    if (!foodId || !bhaji || !about || !price || !area) {
      return res.status(400).json({ success: false, message: "All Fields are Mandatory" });
    }

    const foodPost = await Mess.findById(foodId);
    if (!foodPost) {
      return res.status(404).json({ success: false, message: "Food Post not found" });
    }

    foodPost.bhaji = bhaji;
    foodPost.about = about;
    foodPost.price = price;
    foodPost.area = area;
    foodPost.description = description;
    foodPost.location = location;
    foodPost.date = Date.now();

    if (req.files && req.files.thumbnailImage) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME, 50);
      foodPost.thumbnailImage = thumbnailImage.secure_url;
    }

    await foodPost.save();

    console.log("Data after ", foodId, bhaji, about, description, price, area);

    return res.status(200).json({
      success: true,
      message: "Updated the Details Successfully",
      data: foodPost,
    });
  } catch (error) {
    console.error("Error while updating the post:", error);
    return res.status(500).json({
      success: false,
      message: "Error Occurred while Updating the Post",
      error: error.message,
    });
  }
};




// Delete the Mess Food
exports.deleteFoodPost = async (req, res) => {
    try {

      const { foodId } = req.query;
      console.log("food id in delete is ",foodId)
      
      const food = await Mess.findById(foodId)                     // Find the Food
      if(!food){
        return res.status(404).json({ message: "Food not found" })
      }
  
      // const foodMess = Mess.foodId                   // Unenroll client from te course
      const userId = food.owner

        await User.findByIdAndUpdate(userId, {$pull: { messes: foodId },})
      
  
      await Mess.findByIdAndDelete(foodId)                  // Delete the Food
  
      return res.status(200).json({
        success: true,
        message: "Food deleted successfully",
      })
    }
     catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }

  exports.getFoodPost = async (req, res) => {
    try {
      
      const {foodId} = req.query;                  // Get the owner ID from the authenticated user or request body
      console.log("foodId id is",foodId)


      // Find all reviews belonging to the post
      const foodPost = await Mess.find({_id:foodId})
      // const ownerMess = await User.find({_id:ownerId}).populate(messes).exec()
      
      if(!foodPost){

        return res.status(404).json({

            status:false,
            message:"foodPost Not found",

        })
    }
      res.status(200).json({                     // Return the owner Food Lists
        success: true,
        data: foodPost,
      })
    }
     catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Food Post",
        error: error.message,
      })
    }
  }
