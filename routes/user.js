const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require('passport');
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");



// Sign Up Routes
router
  .route("/signup")
  .get(userController.renderSignupForm)  // Render signup form
  .post(wrapAsync(userController.signup)); // Handle signup form submission

// Login Routes
router
  .route("/login")
  .get(userController.loginRender) // Render login form
  .post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
  }), userController.login); // Handle login form submission

// Logout Route
router.get("/logout", userController.logout); // Handle logout
module.exports = router;