import React, { useEffect, useState } from "react";
import { useContext } from "react";
import appContext from "../context/AppContext";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import socket from "../socket";
const FriendReq = () => {
  const { getUser, user } = useContext(appContext);
  const [accepted, setAccepted] = useState(false);

  //getting user
  useEffect(() => {
    try {
      const fetchUser = async () => {
        await getUser();
      };
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  }, []);

  //accept request

  const acceptreq = async (id) => {
    try {
      let response = await fetch(
        `${process.env.REACT_APP_HOST}/users/acceptreq/${id}`,
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
        socket.emit("notification", {
          event: "accept",
          sender_id: data.requesterId,
          receiver_id: data.accepterId,
          requester: data.accepterName,
        });
        setAccepted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative min-h-screen my-1">
      <div className="h-10 py-2 px-2 w-full bg-white my-1 flex gap-14 items-center">
        <Link to="/profile" className="font-sans font-semibold flex items-center hover:cursor-pointer">
          <IoIosArrowBack />
          Back
        </Link>
        <span className="text-xl font-sans font-semibold">Friend Requests</span>
      </div>
      <div className="px-1 py-1">
        {user.friendRequest.length === 0 ? (
          <div className=" h-96 flex items-center text-xl font-sans text-gray-600 justify-center w-full">
            <span>No friend Requests</span>
          </div>
        ) : (
          user.friendRequest.map((data, index) => (
            <div
              key={index}
              className="bg-gray-100 flex h-[60px] items-center rounded-md mb-1"
            >
              <div className="w-[75px] px-1 py-1 h-full overflow-hidden rounded-[20px]">
                <img
                  className="h-full w-full"
                  src={`data:image/jpeg;base64,${data.image}`}
                  alt="profile"
                />
              </div>
              <div className="w-full flex justify-between h-full items-center px-2">
                <span className="text-[15px] font-semibold">{data.fullname}</span>
                {accepted ? (
                  <small className="text-black font-sans font-semibold bg-white h-[30px] w-[60px] px-1 py-1 rounded-md">
                    Done
                  </small>
                ) : (
                  <Link
                    className="text-white font-sans font-semibold bg-blue-600 h-[30px] w-[60px] px-1 py-1 rounded-md"
                    onClick={() => acceptreq(data._id)}
                  >
                    Accept
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendReq;
