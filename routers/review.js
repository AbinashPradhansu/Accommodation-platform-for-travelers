const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const expressError= require("../utils/expressError.js");
const {reviewSchema,listingSchema} = require("../schema.js");
const Review=require("../models/review.js");
const User=require("../models/user.js");
const Listing =require("../models/listings.js");
const {validateReview,isLoggedIn, isOwner, isAuthor} = require("../middlewire.js");
 //review post route
const reviewsController = require("../controller/reviews.js")
router.post("/",
    isLoggedIn,validateReview,
    wrapAsync(reviewsController.createReviews));

// review delete
router.delete("/:reviewId",
    isLoggedIn,isAuthor,
    wrapAsync(reviewsController.reviewsDestroyer));


module.exports=router;

