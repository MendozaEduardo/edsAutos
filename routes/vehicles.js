//=====================================================
//                      Variables
//=====================================================

var express                 = require("express"),
    router                  = express.Router(),
    vehicle                 = require("../models/vehicle"),
    middleware              = require("../middleware");

//=========================================================
//                      All Vehicles
//=========================================================

//Show all vehicles
router.get("/", function(req, res){
    //Get all vehicles from DB
    Vehicle.find({}, function (err, allVehicles){
        if (err){
            console.log(err);
        } else {
            res.render("vehicles/index", {vehicles:allVehicles});
        }
    });
});

//=========================================================
//                      CREATE Vehicle
//=========================================================

//CREATE - add new vehicle to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to vehicle array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newVehicle = {
        name: name, 
        image: image, 
        description: desc,
        price: price,
        author: author
    };
    //Create - Add a new vehicle to DB
    Vehicle.create(newVehicle, function(err, newlyCreated){
        if (err){
            console.log("There is an error");
            console.log(err);
        } else {
            console.log("No errors detected, you've listed a new auto!");
            //redirect back to vehicle page
            res.redirect("/vehicles");
        }
    });
});

//NEW - show form to create new vehicle
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("vehicles/new");
});

//=========================================================
//             Individual Vehicle SHOW PAGE
//=========================================================

//SHOW - shows more info about the vehicle
router.get("/:id", function(req, res) {
    //find the vehicle with the provided id
    Vehicle.findById(req.params.id).populate("comments").exec(function(err, foundVehicle){
       if (err){
           console.log(err);
       } else {
           console.log(foundVehicle);
           //render show template with that vehicle
           res.render("vehicles/show", {vehicle: foundVehicle});
       }
    });
});

//=========================================================
//                      EDIT Vehicle
//=========================================================

router.get("/:id/edit", middleware.checkVehicleOwnership, function (req, res) {
    Vehicle.findById(req.params.id, function(err, foundVehicle){
            res.render("vehicles/edit", {vehicle: foundVehicle});
    });
});

//=========================================================
//                      UPDATE VEHICLE
//=========================================================

router.put("/:id", middleware.checkVehicleOwnership, function (req, res){
    //Find and update the correct Vehicle
    Vehicle.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err, updatedVehicle){
        if(err) {
            res.redirect("/vehicles");
        } else {
            res.redirect("/vehicles/" + req.params.id);
        }
    });
});

//=========================================================
//                      DESTROY VEHICLE
//=========================================================

router.delete("/:id", middleware.checkVehicleOwnership, function(req, res){
  Vehicle.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/vehicles");
      } else {
          res.redirect("/vehicles");
      }
  });
});

module.exports = router;