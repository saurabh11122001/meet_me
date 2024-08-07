const express=require('express');
const { userMiddleware } = require('../middleware/isLoggedIn');
const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const router=express.Router();


router.get("/",(req,res)=>{
    res.send("home");
})

router.get("/profile",userMiddleware,async (req,res)=>{
    try {
        let {email}=req.user;
        let user=await userModel.findOne({email:email}).populate("posts").populate('friends').populate('friendRequest');
        if(!user) return res.status(400).send("Invalid");
        res.status(200).send({success:true,user:user});
    } catch (error) {
        res.status(400).send(error.message);
    }
})


//route to get all post
router.get("/allpost", userMiddleware, async (req, res) => {
    try {
        let { email } = req.user;
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send("Unauthorized");

        // Fetch posts sorted by creation date (most recent first)
        let posts = await postModel.find().populate('user').sort({ _id: -1 });

        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

//get comments

router.get("/getcomments/:id",userMiddleware,async (req,res)=>{
    try {
        let {email}=req.user;
        if(!req.params.id) return
        let user= await userModel.findOne({email:email});
        if(!user) return res.status(401).send("Unauthorized user");
        let  comments = await postModel.findOne({_id: req.params.id})
        .select('-image')
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'fullname'
          }
        });
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

module.exports=router;