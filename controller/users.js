 const User = require("../models/user");
module.exports.signUpForm =(req,res) =>{
    res.render("users/signUp.ejs");
};

module.exports.createNewUser =async(req,res,next) =>{
    try{
        let {Email,username,password} =req.body;
        let newUser = new User({Email,username });
        const registeredUser = await User.register(newUser,password);
        // console.log(registeredUser);
        req.login(registeredUser,(err) =>{ //this req.login page help to autologin after signUP
        if(err){
            return next(err);
    };
    req.flash("success"," Welcome to wanderlust");
      res.redirect("/listings");
});
    } catch(e) {
         req.flash("error",e.message);
         res.redirect("/signUp");
    }
};

module.exports.renderLogin =(req,res) =>{
    res.render("users/login.ejs");
};

module.exports.postLogin =async(req,res) =>{
    req.flash("success","welcome back to wanderlust");
    let  redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); 
};

module.exports.userSignOut= (req,res,next) =>{
    req.logout((err) =>{
        if(err){
       return next(err);
    }
    req.flash("success","You are logged out");
    res.redirect("/listings");
});
}