// src/UploadPage.js
import React, { useEffect, useState } from 'react';
import './upload.css'
import { Link, useNavigate } from 'react-router-dom';
const Upload = () => {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [loader,setLoader]=useState(false);
    const navigate=useNavigate();

 
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!text && !file) {
      alert("Please Select a file");
      return;
    }
  
    let host = process.env.REACT_APP_HOST;
    let formData = new FormData();
    formData.append('content', text); 
    formData.append('image', file);
  
    try {
      const response = await fetch(`${host}/post/create`, {
        method: 'POST',
        body: formData,
        credentials: "include"
      });
  
      if (response.ok) {
        setText('');
        setFile(null);
        setLoader(true);
        setTimeout(() => {
          setLoader(false);
          navigate("/");
        }, 3000);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  
  return (
    <>
    <div className="relative">
    {loader?<div className='absolute bg-black opacity-90 w-full h-full flex items-center flex-col'>
    <div className="upload-loader"></div>
    </div>:''}
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-purple-600 p-4">
      <div className="bg-white h-full p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Content</h2>
        
        <div className="mb-4">
          <textarea
            className="w-full h-52 p-2 border bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows="4"
            placeholder="Write a caption here....❤️"
            value={text}
            onChange={handleTextChange}
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">Choose Image </label>
          <input
            type="file"
            onChange={handleFileChange}
            aria-label="Upload File"
            accept="image/*, video/*" 
            name='image'
          />
        </div>
        
          <div className='flex items-center justify-center mt-10'>
            <button className='upload-btn' onClick={handleUpload}>
              Upload
            </button>
          </div>
          <div className='flex items-center justify-center mt-10'>
            <Link className='upload-btn bg-blue-500'to="/">
              Go Back
            </Link>
          </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default Upload;
