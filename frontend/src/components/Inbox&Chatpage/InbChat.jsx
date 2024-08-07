import React, { useEffect, useState } from 'react'
import Inbox from './Inbox'
import Chatpage2 from './Chatpage2'
import { useParams } from 'react-router-dom'
const InbChat = () => {
    const [chatpage2,setChatpage2]=useState(null)
    const {id}=useParams("id");
    useEffect(()=>{
      setChatpage2(id)
    },[id]);
  return (
    <div className='hidden lg:flex h-screen w-screen bg-red-300'>
        <Inbox/>
        {chatpage2?<div className='bg-red-300 h-full w-full'><Chatpage2/></div>:<div>No messages</div>}
    </div>
  )
}

export default InbChat