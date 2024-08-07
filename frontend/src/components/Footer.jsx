// Footer.js
import React from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlus, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const Footer = () => {
  const host = "http://localhost:5000";
  
    
  return (
    <div className="fixed lg:flex-col lg:relative lg:w-72 lg:left-0 sm:w-3/6 sm:left-80 bottom-0 left-0 w-full bg-gradient-to-r from-blue-800 to-purple-600 border-t border-gray-300 z-10 flex justify-around items-center py-2 px-4">
     
      <Link to="/" className="text-white lg:flex lg:gap-2">
        <AiOutlineHome className="w-6 h-6" />
        <span className='hidden lg:block'>Home</span>
      </Link>
    
      <Link to="/search" className="text-white lg:flex lg:gap-2">
        <AiOutlineSearch className="w-6 h-6" />
        <span className='hidden lg:block'>Search</span>
      </Link>
      <Link to="/upload" className="text-white lg:flex lg:gap-2">
        <AiOutlinePlus className="w-6 h-6" />
        <span className='hidden lg:block'>Upload</span>
      </Link>
      <div className="text-white lg:flex lg:gap-2">
        <AiOutlineBell className="w-6 h-6" />
        <span className='hidden lg:block'>News</span>
      </div>
      <Link to='/InbChat' className="hidden lg:block text-white lg:flex lg:gap-2">
        <AiOutlineBell className="w-6 h-6" />
        <span className='hidden lg:block'>Messages</span>
      </Link>
      <Link to="/profile"className="text-white lg:flex lg:gap-2">
        <AiOutlineUser className="w-6 h-6" />
        <span className='hidden lg:block'>Profile</span>
      </Link>
     
    </div>
  );
};

export default Footer;
