const Listing=require("../models/listing");
module.exports.index=async (req, res) => {

  console.log("Req Query",req.query);
  let{category}=req.query;
  console.log('Received category query:', category); 
  if(category===''||category===undefined){
    const allListings = await Listing.find({});
    console.log('All Listings:', allListings); 
    res.render("listings/index.ejs", { allListings });
  }
  else{
    let categoryData=await Listing.find({category:category});
    if(categoryData.length==0){
      req.flash('error',"Sorry Listing not Available");
      res.redirect('/listings');
    }
    else{
      res.render('listings/index.ejs',{allListings:categoryData});
    }
  }

    
  };
  module.exports.renderNewForm=(req, res,next) => {
    console.log(req.user);

    res.render("listings/new.ejs");
  }
  module.exports.renderShow = async (req, res) => {
    let { id } = req.params;
   
        const listing = await Listing.findById(id).populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        }).populate("owner");

        if (!listing) {
            req.flash("error", "Listing doesn't exist");
            return res.redirect("/listings");
        }

        // console.log("Listing:", listing);
        // console.log("Reviews:", listing.reviews);

        res.render("listings/show.ejs", { listing });
    } 


  module.exports.create=async (req, res,next) => {
    
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect("/listings");
    };
    module.exports.edit=async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
          req.flash("error","Listing doesn't exist");
          res.redirect("/listings");
        }
        let originalImageUrl=listing.image.url;
        originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs", { listing,originalImageUrl });
      };
      module.exports.update= async (req, res) => {
        let { id } = req.params;
       let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
       if(typeof req.file!=="undefined"){
       let url=req.file.path;
      let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
       }
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
      };
      module.exports.delete= async (req, res) => {
        let { id } = req.params;
        const deletedlisting = await Listing.findByIdAndDelete(id);
        console.log(deletedlisting);
        req.flash("success", "Listing Deleted!");
        res.redirect("/listings");
    };
// In your search controller
module.exports.search = async (req, res) => {
  const query = req.query.q.trim();
  if (!query) {
    req.flash("error", "Search value empty!");
    return res.redirect("/listings");
  }

  try {
    // Create a regular expression for case-insensitive search
    const regex = new RegExp(query, 'i');
    
    // Search in multiple fields
    const allListings = await Listing.find({
      $or: [
        { title: regex },      // Search by title
        { country: regex },    // Search by country
        { description: regex }, // Search by description if you want
        { location: regex },
          // Optionally search by location if needed
      ]
    });
    console.log(allListings);
    if (allListings.length === 0) {
      req.flash("error", "No listings found.");
    }
   
    // Render search results
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    req.flash("error", "An error occurred while searching.");
    res.redirect("/listings");
  }
};
