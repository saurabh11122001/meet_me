import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineCamera } from 'react-icons/ai';
import './inbox.css'
import appContext from '../context/AppContext';
import socket from '../socket';
const Inbox = () => {
  const {user,getUser,setLoader,onlineList,loader,setNotification}=useContext(appContext);
  const [inbox,setInbox]=useState([]);
  const host=process.env.REACT_APP_HOST;
  const navigate=useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
        if (!user) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
 
  useEffect(() => {
    const getInboxDetails = async () => {
      try {
        const response = await fetch(`${host}/message/inbox`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (response.ok) {
          let data = await response.json();
          setInbox(data);
          setTimeout(()=>{
            setLoader(false)
          },1000)
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching inbox details:", error);
        navigate("/login");
      }
    };
    getInboxDetails();
  }, []);
  const handlechat=()=>{
      if (user && user._id) {
        socket.emit("join room", user._id);
        setNotification(false);
        console.log(onlineList)
  }

}
  return (
    <>
    <div className='relative'>
    {loader ? (
        <div className="loader absolute bg-gray-200  absolute min-h-screen flex items-center justify-center w-full z-10 ">
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 660"
              strokeDashoffset="-330"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 220"
              strokeDashoffset="-110"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"

              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
      ) : (
        ""
      )}    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <Link to="/" onClick={()=>setLoader(true)} className="text-xl font-semibold flex gap-2 items-center" ><AiOutlineArrowLeft/>Messages</Link>
        <div className="flex space-x-4">
          <AiOutlineCamera className="w-6 h-6 text-gray-600 cursor-pointer" />
          <svg className="w-6 h-6 text-gray-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
    
          <input type="text" name="text" className="input" placeholder="Type here..."/>
        </div>
      </div>

   
      <div className="h-full overflow-y-auto">
        {inbox.map((conv, index) =>{
          let id="";
          if(conv.sender._id===user.id){
            id=conv.receiver._id;
          }
          else{
            id=conv.sender._id;
          }
          return(
          
          <Link onClick={handlechat}  to={`/chatpage/${conv.sender._id===user._id?conv.receiver._id:conv.sender._id }`}key={index} className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-100">
            <div className="relative">
              <img src={`data:image/jpeg;base64,${conv.sender._id===user._id?conv.receiver.image:conv.sender.image}`}  className={`w-12 h-12 rounded-full`} />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{conv.sender._id===user._id?conv.receiver.fullname:conv.sender.fullname}</span>
              </div>
              <div className='flex gap-2 w-40 h-5 items-center justify-between'>
              <p className="text-sm text-gray-600">{conv.content}</p>
            
              </div>
            </div>
            <AiOutlineCamera className="w-6 h-6 text-gray-600 cursor-pointer" />
          </Link>
        )})}
      </div>
    </div>
    </div>
    </>
  );
};

export default Inbox;
