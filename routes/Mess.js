const express = require("express")
const router = express.Router()

 
const {createFoodPost,getAllFoodPost,updateFoodPost,deleteFoodPost,getFoodPost} = require("../controllers/Mess")               // Course Controllers Import
const { foodCategory } = require("../controllers/Category")      // Categories Controllers Import
const {createRating,  getAverageRating,getReviews,} = require("../controllers/RatingAndReview")        // Rating Controllers Import
const { auth, isClient, isMessOwner } = require("../middleware/auth")



// ********************************************************************************************************
//                                      Food Post Routes routes (only by Mess Owner)                               *
// ********************************************************************************************************

router.get("/getAllFoodPost",getAllFoodPost)
router.put("/updateFoodPost",auth,isMessOwner,updateFoodPost)
router.delete("/deletePost",auth,isMessOwner,deleteFoodPost)
router.post("/createFoodPost",auth,isMessOwner,createFoodPost)
router.get("/getFoodPost",getFoodPost)
router.get("/foodCategory",foodCategory)

// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// router.post("/editCourse", auth, isInstructor, editCourse)                              // Edit Course routes
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)           // Get all Courses Under a Specific Instructor
// router.delete("/deleteCourse", deleteCourse)                                            // Delete a Course
// router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



// ********************************************************************************************************
//                                      Rating and Review (only by Student)                               *
// ********************************************************************************************************
router.get("/averageRating",getAverageRating) //Need to be change
router.post("/createRating",auth,createRating)
router.get("/getReviews",getReviews)



module.exports = router