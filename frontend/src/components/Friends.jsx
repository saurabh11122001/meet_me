import React, { useEffect } from 'react'
import { useContext } from 'react'
import appContext from '../context/AppContext'
import { Link } from 'react-router-dom';
import { AiFillBackward, AiOutlineBackward } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import socket from '../socket';
const Friends = () => {
const {getUser,user,onlineList}=useContext(appContext);

//getting user
    useEffect(()=>{
      try {
        const fetchUser=async()=>{
          await getUser()
          }
          fetchUser();
      } catch (error) {
        console.log(error);
      }
    },[])

    const handlechat=()=>{
      if (user && user._id) {
        socket.emit("join room", user._id);
        console.log(onlineList)
  }
}

  return (
    <div className='lg:w-96 lg:bg-gradient-to-r from-blue-800 to-purple-600 relative min-h-screen lg:my-0 my-1'>
        <div className='h-10 py-2 px-2 w-full  my-1 lg:bg-gradient-to-r from-blue-800 to-purple-600   flex gap-20 items-center'>
            <Link to="/profile" className='lg:hidden flex items-center font-sans font-semibold'><IoIosArrowBack />Back</Link><span className='font-bold font-sans text-xl lg:text-center lg:text-white'>Friends</span>
        </div>
        <div className='px-1 py-1 '>
          {user.friends.map((data,index)=>(
            <>
            <div key={index} className='bg-gray-100 lg:bg-gradient-to-r from-blue-800 to-purple-600 lg:text-white lg:border lg:border-b-1 border-indigo-500 flex py-2 h-[70px] items-center rounded-md mb-1'>
            <div className='  w-[70px]  h-full overflow-hidden rounded-full '><img className='h-full  w-full' src={`data:image/jpeg;base64,${data.image}`}></img></div>
            <div className=' w-full flex justify-between h-full items-center px-2'><span className='text-[15px] font-semibold font-sans'>{data.fullname.toUpperCase()}</span><Link onClick={handlechat} to={`/chatpage/${data._id}`}className='text-white font-sans text-sm font-sans font-semibold bg-blue-600 h-[38px] w-[75px] lg:bg-white lg:text-white lg:text-black px-2 py-2 rounded-md'>Message</Link></div>
          </div>
            </>
        ))}
        </div>
    </div>
  )
}

export default Friends