const mongoose = require("mongoose");
const initData = require("./data.js");
const mongoUrl ='mongodb://127.0.0.1:27017/wonderlust'

const Listing = require("../models/listings.js")

connectToDb()

async function connectToDb() {
    try{

    await mongoose.connect(mongoUrl);
    console.log("Connected To Database");
    
    }catch(error){
        console.log(`Datbase Error : ${error}`);
        
    }
}

async function initDb (){
    await Listing.deleteMany({});

    // let data = initData.data.map((data)=>({...data,owner:"68c82db9507ded15b22f26cb"}))

    await Listing.insertMany(initData);
    console.log("Initialized Db");
    
}
initDb()
