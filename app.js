if(process.env.NODE_ENV!="production"){

require("dotenv").config();

}
const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const wrapAsync = require("./utils/wrapAsync.js")
// const mongoUrl ='mongodb://127.0.0.1:27017/wonderlust'
const dbUrl = process.env.ATLASDB_URL;



const Review = require("./models/review.js")

const {listingSchema,reviewSchema} = require("./schema.js");

const userRouter = require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");

const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError.js")

const methodOverride = require('method-override')

const engine = require("ejs-mate");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"superSduperSecret"
    },
    touchAfter:24*3600
})

store.on("erro",(err)=>{
    console.log("Error in mongo session store ",err)
})

const sessionOptions = {
    secret:"superSduperSecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
    store
}
app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


// const wrapAsync = require("./utils/wrapAsync.js")
const Listing = require("./models/listings.js")

connectToDb()

async function connectToDb() {
    try{

    await mongoose.connect(dbUrl);
    console.log("Connected To Database");
    
    }catch(error){
        console.log(`Datbase Error : ${error}`);
        
    }
}

// app.get("/",(req,res)=>{
//     res.send("working");
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");

    res.locals.user = req.user
    next();                
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({

//         email:"manohar@gmail.com",
//         username:"someth9ing"
//     });
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })



app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.engine('ejs', engine);

app.use(express.static(path.join(__dirname,"public")))

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


// app.get("/",async(req,res)=>{
//     let list = new Listing({
//         title:"My new valla",
//         description:"super duper place in ",
//         price:4100,
//         location:"Adoni"
//     })
//     await list.save()
//     console.log("saved");
    
// })


// const validateListingr=(req,res,next)=>{
//     let {error} = listingSchema.validate(req.body)
//     if(error){
//         let errMsg = error.details.map(el=>el.message).join(",")
//         throw new ExpressError(400,errMsg)
//     }else{
//         next()
//     }
// }


// const validateReview=(req,res,next)=>{  
//     let {error} = reviewSchema.validate(req.body)
//     if(error){
//         let errMsg = error.details.map(el=>el.message).join(",")
//         throw new ExpressError(400,errMsg)
//     }else{
//         next()
//     }
// }

app.listen(port,()=>{
    console.log(`Server is live at http://localhost:${port}`);
})

// // Get All Listings
// app.get("/listings",async(req,res)=>{
//     let allListings = await Listing.find()
//     res.render("listings/index.ejs",{listings:allListings})
// })

// // New Route
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs")
// })

// // Get specific Listing
// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id).populate("reviews")
//    res.render("listings/show.ejs",{listing})
// }))

// // Create Route
// app.post("/listings",validateListingr,wrapAsync(async(req,res,next)=>{  
    
// //     if(!req.body.listing){
// //         throw new ExpressError(400,"Send Valid Data for listing")
// //     }

// // if(!req.body.listing.description){
// // throw new ExpressError(400,"Description is Missing")
// // }
// // if(!req.body.listing.location){
// // throw new ExpressError(400,"Location is Missing")
// // }
// // if(!req.body.listing.title){
// // throw new ExpressError(400,"Title is Missing")
// // }
// // if(!req.body.listing.price){
// // throw new ExpressError(400,"Price is Missing")
// // }
//     let result = listingSchema.validate(req.body)
//     console.log(result);
    
//     const newListing =  new Listing(req.body.listing)
//     await newListing.save()
//     res.redirect("/listings")
   
// }))

// app.get("/listings/:id/edit",async(req,res)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing})
// })

// app.patch("/listings/:id",async(req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,req.body.listing)
//     res.redirect(`/listings/${id}`)
    
// })


// app.delete("/listings/:id",async(req,res)=>{    
//     let {id} = req.params;
//     await Listing.findByIdAndDelete(id)
//     res.redirect("/listings");
// })




// ---------------------------------Reviews--------------------------------

// post review 
// app.post("/listing/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//    let listing = await Listing.findById(req.params.id)
//     let newReview = new Review(req.body.review);
//     await listing.reviews.push(newReview)

//     await newReview.save()
//     await listing.save()
//     res.redirect(`/listings/${listing._id}`)
// }))

// // Delete4 Reviw
// app.delete("/listings/:id/reviews/:reviewId",async(req,res,next)=>{
//     let {id,reviewId} = req.params;
     
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
//     await Review.findByIdAndDelete(reviewId);

//     res.redirect(`/listings/${id}`);                       
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.use(/(.*)/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

app.use((err,req,res,next)=>{
  const {status=500,message="Something Went Wrong"} = err 
  console.log(err);
  
    res.status(status).render("Error.ejs",{message})
}) 





