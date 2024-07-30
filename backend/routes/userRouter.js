const express=require('express');
const router=express.Router();
const {registeredUser,loginUser,logout}=require("../controllers/auth-controller");
const userModel=require("../models/userModel");
const { userMiddleware } = require('../middleware/isLoggedIn');
const upload=require('../config/multer-config');
//route for register user
router.post("/register",registeredUser);

//route for login user
router.post("/login",loginUser);

//route for logout user
router.get("/logout",logout);


//upload photo
router.post("/updateimage", userMiddleware, upload.single("image"), async (req, res) => {
    let { email } = req.user;
    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString('base64');
  
    try {
      let user = await userModel.findOneAndUpdate(
        { email: email },
        { image: imageBase64 },
        { new: true } // This option returns the updated document
      );
  
      if (user) {
        res.status(200).json({ message: "Image updated successfully", updatedimg:user.image });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating image", error });
    }
  });
  

//route to send friend request
router.get("/friendreq/:receiverId",userMiddleware, async function (req,res){
    let {email}=req.user;
    let sender=await userModel.findOne({email:email});
    let receiver=await userModel.findOne({_id:req.params.receiverId});
    if(receiver.friendRequest.includes(sender._id)){
        res.status(200).send("Already Exists");
        return
    }
    receiver.friendRequest.push(sender._id);
    await receiver.save();
    res.status(200).send({message:"request sent"});
})

//route to accept request
router.get("/acceptreq/:requestId", userMiddleware, async function (req, res) {
    try {
        const {email} = req.user; // Replace with req.user.email if dynamically set
        const acceptor = await userModel.findOne({ email: email});
        const requestor = await userModel.findById(req.params.requestId);

        if (!acceptor || !requestor) {
            return res.status(404).send("User not found");
        }

        // Update acceptor's friends and remove requestor from friendRequest
        acceptor.friends.push(requestor._id);
        acceptor.friendRequest = acceptor.friendRequest.filter(id => id.toString() !== requestor._id.toString());

        // Update requestor's friends
        requestor.friends.push(acceptor._id);

        // Save changes
        await acceptor.save();
        await requestor.save();

        res.send({accepterId:acceptor._id,accepterName:acceptor.fullname,requesterId:requestor._id});
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).send("Internal Server Error");
    }
});
//route to getuser
router.get("/getusers",userMiddleware,async (req,res)=>{
    try {
        let users = await userModel.find().populate('friends');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
})

//get receiver

router.get("/getreceiver/:id",userMiddleware,async (req,res)=>{
    let receiver=await userModel.findOne({_id:req.params.id});
    if(!receiver) return
    res.status(200).send(receiver);
})

module.exports=router;