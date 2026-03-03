const express = require("express");
const router = express.Router({});
const User =require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middlewire");

const userController = require("../controller/users.js");


router.route("/signUp")
        .get(userController.signUpForm)
        .post(wrapAsync(userController.createNewUser));

router.route("/login")
        .get(userController.renderLogin)
        .post(saveRedirectUrl,
            passport.authenticate("local",{failureRedirect : "/login" , failureFlash :true}),
                 wrapAsync(userController.postLogin));
router.get("/logOut",(userController.userSignOut));
 
   
module.exports= router;