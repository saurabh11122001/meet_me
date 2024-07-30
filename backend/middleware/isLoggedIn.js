const jwt=require("jsonwebtoken");
const userModel=require("../models/userModel");

module.exports.userMiddleware=async function (req,res,next){
    if(!req.cookies.token){
        res.status(401).send({success:false,message:"You need to login first"});
        return
    }
    try {
        let decode=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user=await userModel.findOne({email:decode.email}).select("-password");
        req.user=user;
        next();
    } catch (error) {
        res.status(400).send("Internal Server Error");
    }
}
