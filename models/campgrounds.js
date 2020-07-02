
var mongoose=require("mongoose");

var campgroundschema=new mongoose.Schema({
    name: String,
    price: String,
    image:String,
    desc: String,
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "comment"
      }
   ]

    
})
module.exports =mongoose.model("camp",campgroundschema);