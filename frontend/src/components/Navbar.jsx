import React, { useEffect } from 'react';
import { FiBell, FiMessageCircle } from 'react-icons/fi';
import { Link,useNavigate } from 'react-router-dom';
import appContext from '../context/AppContext';
import { useContext } from 'react';
const Navbar = () => {
  const {notification,setNotification}=useContext(appContext);
  const {setLoader}=useContext(appContext);
  
  return (
    <nav className="lg:hidden bg-gradient-to-r from-blue-800 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: Web App Name */}
        <div className="flex items-center">
          <span className="text-white text-xl font-sans font-bolder ">MeetMe</span>
        </div>

        {/* Right Side: Icons */}
        <div className="flex items-center">
          {/* Notification Icon */}
          <Link to="/notification"onClick={()=>setNotification(false)}  className="relative text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <FiBell className="h-6 w-6" />
            {notification?<small className='bg-red-700 absolute top-0 left-3  text-xsm  rounded-full text-center w-3 h-3'></small>:''}
          </Link>

          {/* Message Icon */}
          <Link to="/inbox"onClick={()=>setLoader(true)} className="relative ml-4 text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <FiMessageCircle className="h-6 w-6" />
            <small className='bg-red-700 absolute top-0 left-3  text-xsm w-3 h-3 rounded-full text-center'></small>
          </Link>
        </div>
      </div>
    </nav>
  );
};



export default Navbar