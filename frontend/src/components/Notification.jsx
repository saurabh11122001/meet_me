import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import appContext from '../context/AppContext';

const Notification = () => {
    const {notiData}=useContext(appContext);
        
  return (
   <>
   <div className=' min-h-screen w-full bg-gradient-to-r from-blue-800 to-purple-600 '>
    <div className='bg-white h-[50px] gap-3 text-xl font-semibold py-2 px-1 flex'><Link to="/">👈</Link><h1>Notifications</h1></div>
    <div className=' my-1 w-full min-h-screen '>
    {notiData.map((data, index) => (
  <div key={index} className='px-2 bg-white h-15 py-2 flex flex-col mx-2 rounded-md my-1'>
    {data.event === 'like' ? (
      <span>{data.liker} 💗 your post.</span>
    ) : data.event === 'comment' ? (
      <span>{data.sender} commented on your post.</span>
    ) : data.event==='add'?(
      <span>{data.requester} wants to {data.event} you.</span>
    ):(<span>{data.requester} accepted your friend request.</span>)}
    <small className=''>2 minutes ago</small>
  </div>
))}

    </div>
   </div>
   </>
  );
};

export default Notification;
