if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
    // console.log(process.env)
}
const port = process.env.PORT;
const express=require("express");
const app =express();
const mongoose= require("mongoose");
 
const path=require("path");
app.use(express.urlencoded({ extended: true }));
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError= require("./utils/expressError.js");
 app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
const session =require("express-session");
const mongoStore = require('connect-mongo');
const flash =require("connect-flash");
app.use("/uploads", express.static("uploads"));
const listingsRouter =require("./routers/listing.js");
const reviewsRouter =require("./routers/review.js");
const usersRouter =require("./routers/user.js");

const db_url = process.env.ATLAS_DB_URL;;
 
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { error } = require("console");

    main()
    .then(() => {
        console.log("connect db");
    })
    .catch((err) =>{
        console.log(err);
    });
    async function main() {
    await mongoose.connect(db_url);
};
    
const store = mongoStore.create({
    mongoUrl: db_url,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600,
});
 
store.on("error",(err)=>{
    console.log("error in mongoose session store ",err);
})

const sessionOptions ={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    cookie :{
        expires: Date.now() + 7 * 24*60*60*1000,
        maxAge :7 * 24*60*60*1000,
        httpOnly : true,
    },
};

 
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser= req.user;
    next();
});
 

 app.use("/listings", listingsRouter);
 app.use("/listings/:id/reviews", reviewsRouter);
 app.use("/",usersRouter);

app.use((req, res) => {
    (new expressError(404, "Page Not Found"));
});

    app.use((err,req,res,next) =>{
        console.log(err.stack);
    let { statusCode=500, message= "somthing is wrong"}= err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{ err});
});
 

app.listen(port,() => {
    console.log("Server runing at Port 8080");
});