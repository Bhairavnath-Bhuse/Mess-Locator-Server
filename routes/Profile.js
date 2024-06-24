const express = require("express")
const router = express.Router()


// Routes for deleteprofile , updateprofile , updateDisplayPicture;


const { auth, isClient, isMessOwner } = require("../middleware/auth")
const { updateProfile, updateDisplayPicture,getAllUserDetails} = require("../controllers/Profile")
const {getOwnerMessFoodPost,updateFoodPost,deleteFoodPost} = require("../controllers/Mess")
// const {getAverageRating } = require("../controllers/RatingAndReview")
// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.get("/getUserDetails",auth,getAllUserDetails)
router.delete("/deleteProfile", auth, deleteFoodPost)                        // Delet User Account
router.put("/updateProfile", auth, updateProfile)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)

// ********************************************************************************************************
//                                      Food Post routes                                                    *
// ********************************************************************************************************

router.get("/ownerFoodPost",auth,isMessOwner,getOwnerMessFoodPost)
router.put("updateFoodPost",auth,isMessOwner,updateFoodPost)
router.delete("/deletePost",auth,isMessOwner,deleteFoodPost)
// router.get("/averageRating",isMessOwner,getAverageRating)

module.exports = router