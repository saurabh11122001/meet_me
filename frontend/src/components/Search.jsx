import React, { useContext, useEffect, useState } from "react";
import "./search.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import appContext from "../context/AppContext";
import socket from "../socket";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const { user, getUser,onlineList } = useContext(appContext);
  const [sent, setSent] = useState(false);
  const host = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getUser();
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [getUser]); 

  useEffect(() => {
    const search = async () => {
      try {
        const response = await fetch(`${host}/users/getusers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setSearchUsers(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    };
    search();
  }, [host, navigate]); 

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlechat=()=>{
    if (user && user._id) {
      socket.emit("join room", user._id);
      console.log(onlineList)
}
}

  const handleAdd = async (sender_id, receiver_id, fullname) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/users/friendreq/${receiver_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        socket.emit("notification", {
          event: "add",
          sender_id: sender_id,
          receiver_id: receiver_id,
          requester: fullname,
        });
        setSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex gap-2 items-center ">
          <Link to="/">
            <AiOutlineArrowLeft className="text-2xl" />
          </Link>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="space-y-3">
        {searchUsers
          .filter(
            (User) =>
              User.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
              User._id !== user._id
          )
          .map((User, index) =>
            searchTerm.length > 0 ? (
              <Link
                to=""
                key={index}
                className="hover:bg-gray-200 hover:cursor-pointer item-box flex bg-red-200 justify-between items-center space-x-4 bg-white"
              >
                <div className="flex items-center gap-3 justify-center">
                  <img
                    src={`data:image/jpeg;base64,${User?.image}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="text-lg font-medium">{User?.fullname}</span>
                </div>
                <button className="button">
                  {user?.friends.some((data) => data._id === User?._id) ? (
                    <Link onClick={handlechat} to={`/chatpage/${User._id}`}>Message</Link>
                  ) : sent || User?.friendRequest.includes(user?._id) ? (
                    <small>Sent</small>
                  ) : (
                    <small
                      className="text"
                      onClick={() =>
                        handleAdd(user?._id, User?._id, user?.fullname)
                      }
                    >
                      Add
                    </small>
                  )}
                </button>
              </Link>
            ) : null
          )}
      </div>
    </div>
  );
};

export default Search;
