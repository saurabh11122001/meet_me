const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");


const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

const io = socketIo(server, {
    cors: corsOptions
});


require("dotenv").config();

const db = require("./config/mongoose-connection");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const messageRouter = require("./routes/messageRouter");
const index = require("./routes/index");
const userModel = require("./models/userModel");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/auth", index);
app.use("/users", userRouter);
app.use("/post", postRouter);
app.use("/message", messageRouter);



//socket io setups
let onlineUsers = [];
io.on('connection', (socket) => {
    console.log("connected with socket io");

    //When user clicked on a chat
    socket.on("join room",(userId)=>{
        socket.join(userId);
        console.log("Room Joined By",userId);
    })
    //Login 
    socket.on("login", (userId) => {
        // Add user to the connected users list if not already present
        if (!onlineUsers.includes(userId)) {
            onlineUsers.push(userId);
        }
        socket.join(userId);
        console.log("User logged in and room created", onlineUsers);
        io.emit("userOnline", onlineUsers);
    });


    //realtime typing
    socket.on("typing",({id,sender})=>{
        socket.in(id).emit("yestyping",sender);
    })
    // to stop typing
    socket.on("stoptyping",({id,sender})=>{
        socket.in(id).emit("notyping",sender);
    })  
    
    //to send data to specific user
    socket.on("send",async (data)=>{
        let {id,message}=data;
        if(message.sender===id){
            return
        }
        socket.emit("received",message);
        socket.in(id).emit("received",message);
        console.log(message.id);
    })
    //for realtime notification 
    socket.on("notification",(data)=>{
        const {event,liker}=data;
        // when user liked
        if (event==='like'){
            socket.in(data.postuserid).emit("notify",data);
            console.log(`notification: ${liker} person liked your post`);
        }
        if(event ==='add'){
            socket.in(data.receiver_id).emit("request",data);
            console.log(`Friend Request Sent by ${data.sender_id} to ${data.receiver_id}`);
        }
        if(event==='comment'){
            socket.in(data.postuserid).emit("new comment",data);
            console.log(`${data.sender_id} commented on this user id's post ${data.receiver_id} `);
        }
        if(event==='accept'){
            socket.in(data.sender_id).emit("req accept",data);
            console.log(`${data.receiver_id} accept the request of ${data.sender_id}`);
        }
    })

    //when user logged out from app
    socket.on("logout", (userId) => {
        socket.leave(userId);
        console.log("User logged out and room left", userId);
        onlineUsers = onlineUsers.filter(id => id !== userId);
        // Notify all users that this user is offline
        io.emit("userOffline", onlineUsers);
        console.log("After Logged Out the List",onlineUsers);
    });


    //handle disconnect event
    socket.on('disconnect', () => {
        console.log("disconnected");
    });
});



server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
