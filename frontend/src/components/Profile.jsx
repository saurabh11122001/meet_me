import React, { useEffect, useRef } from "react";
import appContext from "../context/AppContext";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import socket from "../socket";
import { FiEdit } from "react-icons/fi";

const Profile = () => {
  const { user, setLoader, getUser, setOnline } = useContext(appContext);
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(null);
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;
  const fileInputRef = useRef(null);

  // Checking User
  useEffect(() => {
    const checkUser = async () => {
      try {
        await getUser();
        if (!user) {
          navigate("/login");
        } else {
          setLoader(true);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/login");
      }
    };

    checkUser();
  }, []);

  // Logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${host}/users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        socket.emit("logout", user._id);
        setLoading(true);
        setTimeout(() => {
          navigate("/login");
          setOnline(false);
          setLoading(false);
        }, 2000);
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    setPic(event.target.files[0]);
  };

  let formData = new FormData();
  formData.append('image', pic);

  const updatePicture = async () => {
    try {
      let response = await fetch(`${process.env.REACT_APP_HOST}/users/updateimage`, {
        method: 'POST',
        body: formData,
        credentials: "include"
      });
      if (response.ok) {
        let data = await response.json();
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!user) {
    return (
      <div className="loader bg-black opacity-70 absolute min-h-screen flex items-center justify-center w-full z-10">
        <div className="text-white text-5xl">Loading..</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="loader bg-black opacity-70 absolute min-h-screen flex items-center justify-center w-full z-10">
        <div className="text-white text-5xl">Loading..</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {loading ? (
          <div className="loader bg-black opacity-70 absolute min-h-screen flex items-center justify-center w-full z-10">
            <div className="wrapper">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="min-h-screen  bg-gray-100 flex flex-col items-center">
          <div className=" relative bg-white w-full max-w-3xl rounded-lg shadow-lg p-4">
            <div className=" relative flex flex-col items-center md:flex-row md:items-center md:justify-between relative">
              <img
                src={`data:image/jpeg;base64,${user.image}`}// Replace with actual image URL
                alt="User"
                className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
              />
              <div>
              <FiEdit onClick={handleIconClick} className="relative bottom-8 left-10 text-black text-3xl cursor-pointer" />
              <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  name="image"
                />
              </div>
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:space-x-8">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-semibold">
                    {user.fullname.toUpperCase()}
                  </h2>
                </div>
                <div className="flex space-x-8 mt-2 justify-center">
                  <div className="text-center">
                    <span className="block font-semibold text-lg text-xl">
                      {user.posts.length}
                    </span>
                    <span className="text-gray-600 font-semibold">Posts</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-semibold text-lg text-xl">
                      {user.friendRequest.length}
                    </span>
                    <Link to="/friendreq"className="text-gray-600 font-semibold">
                      Requests
                    </Link>
                  </div>
                  <div className="text-center">
                    <span className="block font-semibold text-lg text-xl">
                      {user.friends.length}
                    </span>
                    <Link to="/friends" className="text-gray-600 font-semibold">
                      Friends
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center md:text-left">
              <p className="text-gray-600">
                Content Marketing Manager at @vismeapp and Freelance Marketing
                Writer
              </p>
              <p className="text-gray-600">📍 Charleston, SC</p>
              <p className="text-blue-600">chloesocial.com</p>
            </div>
            <div className="flex mt-4 space-x-2 justify-center md:justify-start">
              {pic?<button onClick={updatePicture} className="Btn">
                Update
                <svg className="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
              </button>:<button className="Btn">
                Edit
                <svg className="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
              </button>}
              <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg">
                Share
              </button>
              <button
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg mt-1">
            {user.posts.length > 0 ? (
              <div className="relative grid h-40 grid-cols-3 gap-1">
                {user.posts.map((post, index) => (
                  <div key={index} className="relative pf-div overflow-hidden">
                    <div className="details absolute bg-black h-full w-full opacity-70 flex items-center gap-2 justify-center">
                      <AiFillHeart className="icon" />
                      <small className="text-white">{post.likes.length}</small>
                      <AiOutlineComment className="icon" />
                      <small className="text-white">
                        {post.comments.length}
                      </small>
                    </div>
                    <img
                      src={`data:image/jpeg;base64,${post.image}`}
                      className="pf-image w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-2xl h-96 font-bold">
                No Posts yet
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
