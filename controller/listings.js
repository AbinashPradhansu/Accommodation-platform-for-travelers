 const Listing =require("../models/listings.js");
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken = process.env.map_token;

 const geocodingClient = mbxGeocoding({ accessToken:mapToken });

// index route
module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// get new router

module.exports.renderNewform =(req, res) => {
    res.render("listings/new.ejs");
};

//post new route

module.exports.createListing =async(req,res,next) =>{
 
    const newlisting=new Listing(req.body.listing);
    let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1
  })
    .send();
//   console.log(response.body.features[0].geometry);
    newlisting.owner = req.user._id;
    newlisting.geometry = response.body.features[0].geometry;
    if(req.file){
        let url = req.file.path;
        let filename= req.file.filename;
        newlisting.image= {url,filename};
    }
    let savedListing = await newlisting.save();
    // console.log(savedListing);
    
    req.flash("success","New listings Created");
    return res.redirect("/listings");
    
};

module.exports.updateListing =async(req,res) =>{
    let {id} = req.params;
     let listing =await Listing.findByIdAndUpdate(id ,{...req.body.listing});
      if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
        listing.image={url,filename};
        await listing.save();
      }
        
      req.flash("success","  listings Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.showListings =async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path :"reviews",
         populate : {
            path: "author",
        },
    }).populate("owner");
    // .populate("reviews")
    // .populate("owner");
    // console.log(listing);
    if(!listing){
        req.flash("error", "the Listing you requested is not exist !");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.renderEdit = async(req,res) =>{
    let {id}= req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error", "the Listing you requested is not exist !");
       return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs" ,{listing});
};

module.exports.deleteListing =async(req,res) =>{
    let {id}=req.params;
    let Deletedlisiting = await Listing.findByIdAndDelete(id);
    req.flash("success"," listings Deleted");
   // console.log(Deletedlisiting);
    res.redirect("/listings");
};