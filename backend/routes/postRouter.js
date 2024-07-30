const express=require('express');
const router=express.Router();
const upload=require('../config/multer-config');
const userModel =require("../models/userModel");
const postModel =require("../models/postModel");
const {userMiddleware}=require("../middleware/isLoggedIn");

const socket=require('socket.io');

//route to create post
router.post("/create",userMiddleware,upload.single("image"),async (req,res) =>{
    try {
        let {email} = req.user;
        let {content}=req.body;
        if(!content) return res.status(409).send('please select a picture or write something');
        let user=await userModel.findOne({email:email});
        if(!user) return res.status(500).send("Internal Issue");
        const imageBuffer = req.file.buffer;
        const imageBase64 = imageBuffer.toString('base64');
        let post = await postModel.create({
            content,
            image:imageBase64,
        });
        post.user=user._id;
        user.posts.push(post._id);
        await post.save();
        await user.save();
        res.status(201).send({message:"post created"});

    } catch (error) {
        res.status(400).send("Internal Server Error");
    }

});


//like post

router.post("/like/:id",userMiddleware,async (req,res)=>{
    try {
        let {email}=req.user;
        let user=await userModel.findOne({email:email});
        if(!user) return res.status(401).send("Something Went Wrong");
        let post=await postModel.findOne({_id:req.params.id}).populate("user");
        if(!post) return res.status(401).send("Something Went Wrong");
        let likeIndex = post.likes.indexOf(user._id);
        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
            await post.save();
            return res.status(200).send("Unliked");
        }
        else{
            post.likes.push(user._id);
            await post.save();
            res.status(200).send("Liked");
        }
    } catch (error) {
        res.status(500).send("Not Found");
    }

})

//route to get single users post
router.get("/userspost",userMiddleware,async (req,res) =>{
    try {
        let {email}=req.user;
        let user_post= await userModel.findOne({email:email}).populate('posts');
        res.status(200).send(user_post.posts);
    } catch (error) {
        res.status(500).send("internal server error");
    }
})

router.get("/deletepost/:id",userMiddleware , async (req,res)=>{
    try {
        let {email}=req.user;
        let user= await userModel.findOne({email:email});
        let post = await postModel.findOne({_id:req.params.id});
        if(user._id.toString() === post.user.toString()){
            let del_post= await postModel.findOneAndDelete({_id:req.params.id});
            user.posts=user.posts.filter((id)=>id.toString()!==del_post._id.toString())
            await user.save()
            res.status(200).send({success:true,message:"post deleted"});
        }
        else{
            res.status(401).send("you cannot delete");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

router.post("/comment/:id",userMiddleware,async(req,res)=>{
        try{
            let {comment}=req.body;
            let {email}=req.user;
            let user=await userModel.findOne({email:email});
            if(!user) return res.status(401).send("unauthorized");
            let post =await postModel.findOne({_id:req.params.id});
            post.comments.push({user:user._id,content:comment});
            await post.save();
            res.status(200).send({content:comment,user:{fullname:user.fullname}});
        }
        catch(error){
            res.status(500).send("Internal Server Error");
        }

})


module.exports=router;