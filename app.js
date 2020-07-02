var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var passport=require("passport");
var localstrategy=require("passport-local");
var mongoose=require("mongoose");

var user=require("./models/user")
var camp = require("./models/campgrounds");
var comment= require("./models/comments");
var seeddb = require("./seeds");
var methodoverride=require("method-override");
var flash = require("connect-flash");

app.use(methodoverride("_method"))


//   seeddb();  //seed the database
  


var commentroutes = require("./routes/comments"),
    campgroundroutes = require("./routes/campgrounds"),
    indexroutes = require("./routes/index");



mongoose.connect("mongodb://localhost:27017/yelpcampv3", { useNewUrlParser: true });

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
app.use(flash());


//--------- PASSPORT CONFIGURATION-----------//

app.use(require("express-session")({
    secret:"i am rock",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})



// requriring routes
app.use("/",indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);


app.listen(8080,function(){
    console.log("started");
})


