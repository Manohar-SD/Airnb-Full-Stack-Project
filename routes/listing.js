const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")

const {storage} = require("../ccloudConfig.js")

const multer  = require('multer')
const upload = multer({storage:storage})

router.route("/")
.get(wrapAsync(listingController.index))
.post(upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing)) 
// .post(,(req,res)=>{
//     res.send(req.file)
// })

;


// New Route
router.get("/new",isLoggedIn,listingController.renderNewForm)


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete(isOwner,isLoggedIn,wrapAsync(listingController.destroyListing))
.patch(isOwner,isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))



// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))


module.exports = router 