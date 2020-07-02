var express=require("express");
var router= express.Router();
var camp=require("../models/campgrounds");
var middleware = require("../middleware"); // no need to specify index.js as it is the default file
var multer = require('multer');
//establish image upload
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|jfif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'paarth', 
  api_key: 178649916374972, 
  api_secret: "4Bzs9FJCI2Y4WXK5J7qYVXInN0Q"
});

router.get("/",function(req,res){
    camp.find({},function(err,camps){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/campground",{camp: camps})
        }
    })
});

router.get("/new",middleware.isloggedin, function(req, res) {
    res.render("campgrounds/new");
})

//SHOW ROUTE !!!!!!!
router.get("/:id",function(req,res){
    camp.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
        if(err){
            console.log(err)
        }
        else{
            if(!foundcampground){
                return res.status(400).send("Item not found")
            }
            res.render("campgrounds/display",{camp : foundcampground});
        }
    });
})

//POST ROUTE
router.post("/",middleware.isloggedin, upload.single('image'),function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the campground object under image property
      req.body.campground.image = result.secure_url;
      console.log(result.secure_url);
      // add author to campground
      req.body.campground.author = {
        id: req.user._id,
        username: req.user.username
      }
      camp.create(req.body.campground, function(err, campground) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/campgrounds/' + campground.id);
      });
    });
})

//edit campground route
router.get("/:id/edit",middleware.isloggedin,function(req, res) {
    //is user logged in 
    camp.findById(req.params.id,function(err, foundcampground) {
        if(err){
            
            console.log(err)
        }
        else{
            res.render("campgrounds/edit",{campground:foundcampground})
        }
    })

    //then run the main code else redirect
    //if not redirect
    

})
//Update route
router.put("/:id",middleware.checkcampgroundowner,function(req,res){
    //find and update 
    
    camp.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
    //redirect somewhere
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkcampgroundowner,function(req,res){
    camp.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds")
        }
    })
})


module.exports=router;