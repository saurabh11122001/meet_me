// Footer.js
import React from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlinePlus, AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const Footer = () => {
  const host = "http://localhost:5000";
  
    
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-blue-800 to-purple-600 border-t border-gray-300 flex justify-around items-center py-2 px-4">
      <Link to="/" className="text-white">
        <AiOutlineHome className="w-6 h-6" />
      </Link>
      <Link to="/search" className="text-white">
        <AiOutlineSearch className="w-6 h-6" />
      </Link>
      <Link to="/upload" className="text-white">
        <AiOutlinePlus className="w-6 h-6" />
      </Link>
      <div className="text-white">
        <AiOutlineBell className="w-6 h-6" />
      </div>
      <Link to="/profile"className="text-white">
        <AiOutlineUser className="w-6 h-6" />
      </Link>
     
    </div>
  );
};

export default Footer;
