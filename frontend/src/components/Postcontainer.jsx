import React, { useContext, useEffect, useState } from "react";
import {
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineMore,
  AiOutlineClose,
} from "react-icons/ai";
import "./post.css";
import appContext from "../context/AppContext";
import { Link } from "react-router-dom";
import socket from "../socket";
const Postcontainer = ({ posts }) => {
  const { user, getUser, onlineList } = useContext(appContext);
  const [commentText, setCommentText] = useState("");
  const [comment, setComment] = useState(false);
  const [Index, setIndex] = useState(null);
  const [comentContent, setCommentContent] = useState([]);
  useEffect(() => {
    try {
      const fetchuser = async () => {
        await getUser();
      };
      fetchuser();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const doLike = async (id, post_user_id) => {
    const response = await fetch(
      `${process.env.REACT_APP_HOST}/post/like/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      socket.emit("notification", {
        postid: id,
        postuserid: post_user_id,
        event: "like",
        liker: user?.fullname,
      });
    }
  };
  const getComment = async (postid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/auth/getcomments/${postid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        let data = await response.json();
        setCommentContent(data.comments);
      } else {
        console.error("Failed to fetch comments", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const doComment = async (postid, post_user_id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_HOST}/post/comment/${postid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: commentText }),
          credentials: "include",
        }
      );
      if (response.ok) {
        let data = await response.json();
        setCommentContent([...comentContent, data]);
        socket.emit("notification", {
          postuserid: post_user_id,
          sender_id: user?._id,
          receiver_id: post_user_id,
          event: "comment",
        });
        setCommentText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onChange = (e) => {
    setCommentText(e.target.value);
  };
  return (
    <>
      <div className="px-1 py-1 h-5/6 overflow-y-auto">
        {posts.map((post, index) => (
          <div
            key={index}
            className="post-card bg-white shadow-md rounded-lg p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="w-60  h-10 flex gap-2 items-center w-96 ">
                <img
                  className="w-10 rounded-full h-full"
                  src={`data:image/jpeg;base64,${post.user?.image}`}
                  alt=""
                />
                {user?._id===post.user?._id?<strong className="text-sm  w-32">You</strong>:<strong className="text-sm  w-32">{post.user?.fullname}</strong>}
                {onlineList.includes(post.user?._id) && user?._id!==post.user?._id? (
                  <small className="text-[10px]  w-17">Active Now 🟢</small>
                ) : (
                  ""
                )}
              </div>
              <div className="relative flex gap-4 items-center justify-center">
                <AiOutlineMore className="text-gray-600 cursor-pointer" />
                {/* <div className='absolute bg-gray-200  w-26 top-5 right-2 h-32 flex flex-col py-2 items-center rounded-lg justify-between px-2'>
              <h1 className='font-sans font-semibold cursor-pointer'>View Profile</h1>
              <h1 className='font-sans font-semibold cursor-pointer'>Saved</h1>
              <h1 className='font-sans font-semibold cursor-pointer'>Unfollow</h1>
              <h1 className='font-sans font-semibold cursor-pointer'>Report</h1>
            </div> */}
              </div>
            </div>
            <div className="text-gray-700 h-auto font-sans">
              <div className="px-2 py-2 text-gray-500">{post.content}</div>
            </div>
            <div className="relative mb-4 h-96">
              <img
                loading="lazy"
                src={`data:image/jpeg;base64,${post.image}`}
                alt="Post"
                className="w-full h-full object-cover rounded-lg"
              />

              {/* comment section */}

              {comment && Index === index ? (
                <div
                  key={index}
                  className="flex flex-col gap-2 absolute top-0 w-full bg-gray-300  p-2 h-full rounded-lg"
                >
                  <div className="flex items-center justify-end text-white text-xl">
                    <AiOutlineClose
                      onClick={() => {
                        setComment(false);
                        setIndex(null);
                      }}
                    />
                  </div>
                  <div className="comments bg-white w-full h-72 rounded-lg p-1 overflow-y-auto">
                    {comentContent.length === 0 ? (
                      <div className="text-center text-gray-500">
                        No comments
                      </div>
                    ) : (
                      comentContent.map((data, index) => (
                        <div key={index} className="indi-com p-1">
                          <div className="flex gap-2">
                            <span className="font-bold">
                              {data.user.fullname}
                            </span>
                            <span>{data.content}</span>
                          </div>
                          <div className="flex gap-3 text-gray-500 font-bold">
                            <small>Like</small>
                            <small>Reply</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="bg-white w-full h-10 p-1 flex gap-1">
                    <input
                      value={commentText}
                      onChange={onChange}
                      type="text"
                      className="bg-gray-200 w-full h-full rounded-lg px-2 outline-none"
                      placeholder="Write your comment.."
                    />
                    <button
                      className="bg-blue-500 h-full w-20 text-white rounded-md hover:cursor-pointer"
                      onClick={() => doComment(post._id, post.user?._id)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex justify-around  items-center text-gray-600">
              <div className="flex flex-col items-center">
                <div
                  onClick={() => doLike(post._id, post.user?._id)}
                  className="heart-container"
                  title="Like"
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    id="Give-It-An-Id"
                  />
                  <div className="svg-container">
                    <svg
                      viewBox="0 0 24 24"
                      className="svg-outline"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                    </svg>
                    <svg
                      viewBox="0 0 24 24"
                      className="svg-filled"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                    </svg>
                    <svg
                      className="svg-celebrate"
                      width="100"
                      height="100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="10,10 20,20"></polygon>
                      <polygon points="10,50 20,50"></polygon>
                      <polygon points="20,80 30,70"></polygon>
                      <polygon points="90,10 80,20"></polygon>
                      <polygon points="90,50 80,50"></polygon>
                      <polygon points="80,80 70,70"></polygon>
                    </svg>
                  </div>
                </div>
                <button className="font-semibold text-sm">
                  {post.likes.length}
                </button>
              </div>
              <div className="flex flex-col items-center">
                <AiOutlineComment
                  onClick={() => {
                    setComment(true);
                    setIndex(index);
                    getComment(post._id);
                  }}
                  className="w-6 h-6 cursor-pointer hover:text-blue-500"
                />
                <small className="font-semibold">{post.comments.length}</small>
              </div>
              <div className="flex flex-col items-center">
                <AiOutlineShareAlt className="w-6 h-6 cursor-pointer hover:text-green-500" />
                <small className="font-semibold">5 Share</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Postcontainer;
