var express=require("express");
var router= express.Router();
var camp=require("../models/campgrounds");
var comment=require("../models/comments");
var user=require("../models/user");
var passport=require("passport")
var middleware = require("../middleware");

//root route
router.get("/",function(req,res){
    res.render("landing");
});





//-----------------AUTHENTICATION ROUTES --------------------------------//

//show register
router.get("/register",function(req, res) {
    res.render("register");
});

//handle signup logic
router.post("/register",function(req, res) {
    var newuser= new user({username: req.body.username});
    user.register(newuser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            res.redirect("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp "+ user.username)
            res.redirect("/campgrounds");
        });
    });
});

//Login Route
router.get("/login",function(req, res) {
    res.render("login");
});
//Login Logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req,res){
});

//Logout route
router.get("/logout",function(req, res) {
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/campgrounds");
})


module.exports=router;