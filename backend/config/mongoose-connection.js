const mongoose=require('mongoose');
const config=require("config");
const dbgr=require("debug")("development:mongoose");


//creating connection with mongoose
mongoose.connect(`${process.env.MONGODB_URI}/socialmedia`)
.then(function(){
    dbgr("connected");
})
.catch(function(err){
    console.log(err);
})

module.exports=mongoose.connection;