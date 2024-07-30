const userModel=require("../models/userModel");
const bcrypt=require("bcrypt");
const {generateToken}=require("../utils/generator")

module.exports.registeredUser=async function (req,res){
        try {
            let {fullname,email,password,contact}=req.body;
            let user =await userModel.findOne({contact:contact});
            if (user) return res.status(409).send({success:false,message:"User Already Exists"});
            bcrypt.genSalt(10,function (err,salt){
                bcrypt.hash(password,salt,async function (err,hash){
                    if(err) return res.send(err.message);
                    else{
                        try {
                            let user=await userModel.create({
                                fullname,
                                email,
                                password:hash,
                                contact
                            })
                            let token=generateToken(user);
                            res.cookie("token",token);
                            res.status(201).send({success:true,message:"user created",userid:user._id});
                        } catch (error) {
                            res.status(400).send({message:"Internal Server Error"});
                        }
                    }
                })
            })
        } catch (error) {
            res.status(400).send({message:"Internal Server Error"})
        }
}

module.exports.loginUser=async function (req,res){
    try {
        let {email, password}=req.body;
        let user=await userModel.findOne({email:email});
        if (!user) return res.status(401).send({success:false,message:"email or Password Incorrect"});
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                    let token=generateToken(user);
                    res.cookie("token",token);
                    res.status(200).send({success:true,message:"successfully logged in",userid:user._id});
            }
            else{
                res.status(401).send({success:false,message:"email or Password Incorrect"});
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports.logout=async function (req,res){
    res.cookie("token","");
    res.status(200).send({success:true,message:"successfully logged out"});
}