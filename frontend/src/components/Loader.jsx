import React, { useEffect } from 'react';
import './loader.css'
import appContext from '../context/AppContext';
import { useContext } from 'react';
const Loader = () => {
  const {loader,setLoader}=useContext(appContext);
    useEffect(() => {
        setTimeout(() => {
          setLoader(false);
        }, 500); 
      }, [loader]);
  return (
    <>
    <div className="w-full h-1 bg-white rounded-full overflow-hidden">
      {loader?<div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-loader"></div>:''}
    </div>
    </>
  );
};

export default Loader;