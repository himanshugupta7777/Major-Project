const express=require("express");
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,  upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));

// New Route - Render form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);
//search
router.get("/search", listingController.search);
// router.get("/category",listingController.category);
//filter
// router.get("/filter/:id", wrapAsync(listingController.filter));
//Edit Route
router.get("/:id/edit", isLoggedIn ,isOwner,wrapAsync( listingController.edit));
// Show Route - Display a specific listing by ID
router.route("/:id")
    .get(wrapAsync(listingController.renderShow))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));
  
  module.exports=router;