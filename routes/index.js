//=====================================================
//                      Variables
//=====================================================

var express                 = require("express"),
    router                  = express.Router(),
    passport                = require("passport"),
    User                    = require("../models/user");

//============================================
//                  ROOT
//============================================

router.get("/", function(req, res){
    res.render("landing");
});

//============================================
//                  Register
//============================================

//SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//SIGN UP LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Ed's Autos " + user.username);
            res.redirect("/vehicles");
        });
    });
});

//=====================================================
//                      Login
//=====================================================

//Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

//Login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/vehicles",
        failureRedirect: "/login"
    }), function(req, res){
});

//============================================
//                  LOGOUT ROUTES
//============================================

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You've been logged out");
    res.redirect("/vehicles");
});

module.exports = router;