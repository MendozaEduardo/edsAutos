//==================================================================================================
//                                            Variables     
//==================================================================================================
var Vehicle                         = require("../models/vehicle"),
    Comment                         = require("../models/comment"),
    middlewareObj                   = {};
//==================================================================================================
//                                      All Middleware Goes Here     
//==================================================================================================
middlewareObj.checkVehicleOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Vehicle.findById(req.params.id, function(err, foundVehicle){
          if(err){
              req.flash("error", "Sorry, that vehicle cannot be found.");
              res.redirect("back");
          } else {
              //does user own vehicle?
              if(foundVehicle.author.id.equals(req.user._id)) {
                  next();
              } else {
                  req.flash("error", "Sorry, you don't have permission to edit that.")
                  res.redirect("back");
              }
            }
         });
    } else {
        req.flash("error", "Sorry, you need to be logged in to do that.")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
              if(err){
                  res.redirect("back");
              } else {
                  //does user own comment?
                  if(foundComment.author.id.equals(req.user._id)) {
                      next();
                  } else {
                      req.flash("error", "Sorry, you don't have permission to do that.")
                      res.redirect("back");
                  }
                }
             });
        } else {
            req.flash("error", "Sorry, you need to be logged in to do that.")
            res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Sorry, you need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj;