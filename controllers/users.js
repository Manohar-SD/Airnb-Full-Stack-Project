
const User = require("../models/user.js");

module.exports.renderSignup = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>{
    try{
        const {username,password,email} = req.body;
    const user = new User({
        email,username
    });
    const registereedUser = await User.register(user,password)

    req.login(registereedUser,(err)=>{
        if(err){
            next(err)
        }
        req.flash("success","Welcome to WonderLust")
        res.redirect("/listings")
    })
   
}catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs",)
}

module.exports.login  = async(req,res)=>{
    req.flash("success","Welcome User");
    let redirectUrl =  res.locals.redirectUrl || "/listings"
    // let redirectUrl = req.locals.redirectUrl !==undefined ? req.locals.saveRedirectUrl : "/listings";
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Your are logged out")
        res.redirect("/listings")
    }))
}
