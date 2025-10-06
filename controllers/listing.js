const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError");


module.exports.index = async (req, res) => {
    let query = req.query.title || "";
    let category = req.query.category || "";
    console.log(category);
    let allListings = await Listing.find({category:{$regex:category,$options:"i"},title:{$regex:query,$options:"i"}});
    if(allListings.length==0){
        throw new ExpressError(400,"No Listings Found for your Search");
    }
    res.render("listings/index.ejs", { listings: allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    // if(!listing){
    //     // req.flash("error","Listing you requested for doesn't existss")
    //     res.redirect("/listings")
    // }

    if (!listing) {
        req.flash("error", "Listing you requested for doesn't existss")
        res.redirect("/listings")
    } else {
        res.render("listings/show.ejs", { listing })
    }
}

module.exports.createListing = async(req,res,next)=>{  
    
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send Valid Data for listing")
//     }

// if(!req.body.listing.description){
// throw new ExpressError(400,"Description is Missing")
// }
// if(!req.body.listing.location){
// throw new ExpressError(400,"Location is Missing")
// }
// if(!req.body.listing.title){
// throw new ExpressError(400,"Title is Missing")
// }
// if(!req.body.listing.price){
// throw new ExpressError(400,"Price is Missing")
// }

let url= req.file.path;
let filename= req.file.filename;
    const newListing =  new Listing(req.body.listing)
    newListing.image = {
        url,filename
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings")
   
}

module.exports.renderEditForm =async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

        if(!listing){
        req.flash("error","Listing you requested for doesn't existss")
     return    res.redirect("/listings")
    }

    let originalImgUrl = listing.image.url;
   originalImgUrl= originalImgUrl.replace("/upload","/upload/h_300,w_250")

    res.render("listings/edit.ejs",{listing,originalImgUrl})    

}

module.exports.updateListing =async(req,res)=>{
    let {id} = req.params;    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(req.file!==undefined){
            let url= req.file.path;
            let filename= req.file.filename;
            listing.image = {
                url,filename
            }
        await    listing.save();
    }

     req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async(req,res)=>{    
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Delted Succesfully")
    res.redirect("/listings");
}