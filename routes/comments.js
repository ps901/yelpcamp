var express=require("express");
var router= express.Router({mergeParams: true});
var camp=require("../models/campgrounds");
var comment=require("../models/comments");
var middleware = require("../middleware");

// comments new

router.get("/new",middleware.isloggedin,function(req, res) {
    camp.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground: campground})
        }
    })
})


//comments save 
router.post("/",middleware.isloggedin,function(req,res){
    //loookup camground using id
    //create new comment 
    //connect comment to campground
    //redirect to show camp page
    camp.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","something went wrong")
                    console.log(err)
                }
                else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username=req.user.username;
                    //save the comment
                    comment.save();
                    // add the comment to the campground 
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment !!! ")
                    res.redirect("/campgrounds/"+campground._id)
                }
            });
        }
    });
});

//edit comment
router.get("/:comment_id/edit",middleware.checkcommentowner,function(req,res){
    //camp.findById() no need to do that because id is presenet in the route
    comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/edit",{comment:foundcomment, campgroundid: req.params.id})
        }
    })
})

//update comment
router.put("/:comment_id",middleware.checkcommentowner,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//delete route
router.delete("/:comment_id",middleware.checkcommentowner,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})

module.exports=router;