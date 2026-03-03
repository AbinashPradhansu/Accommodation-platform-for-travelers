const Listing = require("./models/listings");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const expressError= require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be login first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl =(req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) =>{
        if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    }

    let { id } = req.params;
    let listing = await Listing.findById(id);
        if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    // res.locals.currUser._id
    if(!listing.owner.equals(req.user._id)){
        req.flash("error", " You are not owner of the listings");
        return res.redirect(`/listings/${id}`);
    };
    next();
};
    // validate lsiting
module.exports.validateListing=(req,res,next)=>{ 
    let {error}= listingSchema.validate(req.body); 
    if(error){ let errMsg= error.details.map((el)=>el.message).join(","); 
        throw new expressError(400, errMsg);
 }
else{  
   next();

 } 
};

// validate reviews
 module.exports.validateReview=(req,res,next)=>{ 
    let {error}= reviewSchema.validate(req.body); 
    if(error){ let errMsg= error.details.map((el)=>el.message).join(","); 
        throw new expressError(400, errMsg);
 }
else{  
   next();
 }
 };

 module.exports.isAuthor = async(req,res,next) =>{
      if(!req.isAuthenticated()){
        req.flash("error","You must be logged in");
        return res.redirect("/login");
    };
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash("error","Review not found");
        return res.redirect(`/listings/${id}`);
    };
    // res.locals.currUser._id
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not auther of the listings");
        return res.redirect(`/listings/${id}`);
    };
    next();
};