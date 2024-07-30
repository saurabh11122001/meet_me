import React, { useContext, useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { FaArrowLeft, FaPhone, FaVideo } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import appContext from "../context/AppContext";
const ChatPage = () => {
  const [message, setMessage] = useState("");
  const {
    getUser,
    user,
    receiver,
    onlineList,
    getReceiver,
    setNotification,
    notification,
  } = useContext(appContext);
  const [receivedMessage, setReceivedMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);
  let navigate = useNavigate();
  const { id } = useParams("id");

  useEffect(() => {
    try {
      getReceiver(id);
    } catch (error) {
      console.error("Error fetching receiver:", error);
    }
  }, []);
  useEffect(() => {
    socket.on(
      "yestyping",
      (sender) => {
        if (sender === id) {
          setIstyping(true);
        }
      },
      []
    );
    socket.on("notyping", (sender) => {
      if (sender === id) {
        setIstyping(false);
      }
    });
  });
  useEffect(() => {
    const checkUser = async () => {
      try {
        await getUser();
        if (!user) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();
  }, []);
  const handleSubmit = async (e) => {
    socket.emit("stoptyping", { id, sender: user._id });
    e.preventDefault();
    if (message.trim()) {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_HOST}/message/sent/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: message }),
            credentials: "include",
          }
        );
        if (response.ok) {
          socket.emit("send", {
            message: { sender: user._id, receiver: id, content: message },
            id,
          });
          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  useEffect(() => {
    socket.on("received", (message) => {
      if (message.sender !== id && message.receiver !== id) {
        setNotification(true);
      } else {
        setReceivedMessages((prevMessages) => [...prevMessages, message]);
        console.log("yes");
      }
    });

    return () => {
      socket.off("received");
    };
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/message/getmessages/${id}`,
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
          setReceivedMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const onChange = (e) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { id, sender: user._id });
    }
    let lastTypingTime = new Date().getTime();
    let timerLenght = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var time_diff = timeNow - lastTypingTime;
      if (time_diff >= timerLenght && typing) {
        socket.emit("stoptyping", { id, sender: user._id });
        setTyping(false);
      }
    }, timerLenght);
  };

  const handlepopup = () => {
    setNotification(false);
  };
  return (
    <div className="relative flex font-sans flex-col h-screen max-w-md mx-auto border p-4 bg-white">
      {notification ? (
        <div
          onClick={() => handlepopup}
          className="absolute animate-bounce top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
        >
          <p className="text-sm font-semibold">New</p>
        </div>
      ) : (
        ""
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Link to="/inbox">
            <FaArrowLeft className="text-gray-500 cursor-pointer" />
          </Link>
          <p className="text-lg font-semibold">{receiver.fullname}</p>
          {istyping ? (
            <small className="text-sm text-green-500 font-semibold">
              Typing..
            </small>
          ) : onlineList.includes(id) ? (
            <small className="text-sm text-green-500 font-semibold">
              Online..
            </small>
          ) : (
            ""
          )}
        </div>
        <div className="flex items-center space-x-4">
          <FaPhone className="text-gray-500 cursor-pointer text-black" />
          <FaVideo className="text-gray-500 cursor-pointer text-black" />
          <AiOutlineMore className="text-gray-500 cursor-pointer text-black" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex flex-col w-full h-full w-full gap-3 my-2">
            <div className="flex flex-col w-full gap-3 ">
              {receivedMessage.map((message, index) => {
                const isCurrentUser = message.sender === user._id;
                return (
                  <div
                    key={index}
                    className={`w-full flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        isCurrentUser
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-gray-200"
                      } h-16 rounded-md px-2 py-2 w-40`}
                    >
                      <p className="text-sm font-semibold">{message.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <form onClick={handleSubmit} className="flex w-full">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 border rounded-lg p-2"
            onChange={onChange}
            value={message}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-800 to-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
