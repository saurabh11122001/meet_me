import AppContext from "./AppContext";
import { useEffect, useState } from "react";
import socket from "../socket";
const AllStates = (props) => {
  const [loader, setLoader] = useState(false);
  const [inbox, setInbox] = useState(false);
  const [user, setUser] = useState("");
  const [isAlert, setAlert] = useState(false);
  const [isonline,setOnline]=useState(false);
  const [onlineList,setOnlineList]=useState([]);
  const [receiver,setReceiver]=useState('');
  const [notification,setNotification]=useState(false);
  const [notiData,setNotidata]=useState([]);
  const [selectedChatId,setSelectedChatId]=useState("");

  
  const getUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/auth/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        let data = await response.json();
        setUser(data.user);
      } else {
        console.error("Failed to fetch user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const getReceiver = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/users/getreceiver/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        let data = await response.json();
        setReceiver(data);
      } else {
        console.error(`Failed to fetch receiver with ID ${id}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error fetching receiver with ID ${id}:`, error);
    }
  };
  
  useEffect(()=>{
    // Handle individual user online event
    socket.on("userOnline", (data) => {
      setOnlineList(data);
    });
    socket.on("userOffline",(data)=>{
      setOnlineList(data);
    })
    socket.on("notify",(data)=>{
        setNotification(true);
        console.log("notification")
        setNotidata([...notiData,data]);
    })
    socket.on("request",(data)=>{
       setNotification(true);
       console.log("someone wants your friendship");
       setNotidata([...notiData,data]);
    })
    socket.on("new comment",(data)=>{
      setNotification(true);
      console.log("someone commented");
      setNotidata([...notiData,data]);
    })
    socket.on("req accept",(data)=>{
      setNotification(true);
      console.log("request accepted");
      setNotidata([...notiData,data]);
    })
    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off("notify");
      socket.off("request");
      socket.off("new comment");
      socket.off("req accept");
  };
  },[]);
  return (
    <AppContext.Provider value={{loader,setLoader,inbox, setInbox,user, setUser,isAlert,
     setAlert,isonline,setOnline,getUser,
     setOnlineList,onlineList,receiver,setReceiver,getReceiver,selectedChatId,setSelectedChatId,notification,
     setNotification,notiData,setNotidata}}>
      {props.children}
    </AppContext.Provider>
  )
}


export default AllStates;