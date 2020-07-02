var camp=require("../models/campgrounds");
var comment=require("../models/comments")

// all the middleware goes here
var middleware_obj={};

middleware_obj.checkcampgroundowner = function (req,res,next){
    if(req.isAuthenticated()){
        camp.findById(req.params.id,function(err,foundcampground){
            if(err){
                res.redirect("back")
            }
            else{
                //wromg url camp not found
                if(!foundcampground){
                    return res.status(400).send("Item not found");
                }
                //does user own campground
                if(foundcampground.author.id.equals(req.user._id)){
                    next()
                }
                else{
                    res.redirect("back")
                }
            }
        })
    }
    else{
        res.redirect("back")
    }
}

middleware_obj.checkcommentowner = function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err){
                req.flash("error","campground not found")
                console.log(err);
            }
            else{
                //does user own campground
                if(foundcomment.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    req.flash("error","You dont have permission to do that ")
                    res.redirect("back")
                }
            }
        })
    }
    else{
        req.flash("error","You have to be logged in to do that")
        res.redirect("back");
    }
}

middleware_obj.isloggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that !!!");
    res.redirect("/login");
}

module.exports = middleware_obj;