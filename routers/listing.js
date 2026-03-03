const express = require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const expressError= require("../utils/expressError.js");
const {listingSchema } = require("../schema.js");
const Listing =require("../models/listings.js");
const {isLoggedIn,validateListing, isOwner} =require("../middlewire.js");

const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require('../cloudinary.js');
const upload = multer({storage});
// index route
router.route("/")
     .get( wrapAsync(listingController.index))
     .post(isLoggedIn,
          upload.single('listing[image]'),
          validateListing,
          wrapAsync
          (listingController.createListing));

// new route (form)
router.get("/new",isLoggedIn,(listingController.renderNewform));


router.route("/:id")
     .get( 
     wrapAsync(listingController.showListings))
     .put(isLoggedIn,
          isOwner,
          upload.single('listing[image]'),
          validateListing,
      wrapAsync(listingController.updateListing))
     .delete(isLoggedIn,isOwner,
     wrapAsync(listingController.deleteListing));

 
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingController.renderEdit));
 
module.exports=router;