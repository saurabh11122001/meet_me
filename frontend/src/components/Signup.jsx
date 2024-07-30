import React, { useContext } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appContext from '../context/AppContext';
import socket from '../socket';
const Signup = () => {
    const [cred, setcred] = useState({fullname:"",email:"",password:"",contact:""});
    const host=process.env.REACT_APP_HOST;
    const [loader,setLoader]=useState(false);
    const {setAlert}=useContext(appContext);
    const navigate=useNavigate();
    //handle submit function
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${host}/users/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullname: cred.fullname,
            email: cred.email,
            password: cred.password,
            contact: cred.contact
          }),
          credentials: "include"
        });
    
        const data = await response.json();
    
        if (data.success) {
          socket.emit("login", data.userid);
          if (document.cookie) {
            setcred({ fullname: "", email: "", password: "", contact: "" });
            let token = getCookie("token");
            if (token) {
              localStorage.setItem("token", token);
            }
            setLoader(true);
            setAlert(true);
            setTimeout(() => {
              setLoader(false);
              navigate("/");
              setTimeout(() => {
                setAlert(false);
              }, 1000);
            }, 1000);
          }
        } else {

          console.error('Registration failed:', data.message);
        }
      } catch (error) {
        console.error('An error occurred:', error);

      }
    };
    
    const onChange=(e)=>{
        setcred({...cred,[e.target.name]:e.target.value});
    }

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }

  return (
    <>
    <div className="relative">
      {loader ? (
        <div className="loader bg-black opacity-70 absolute min-h-screen flex items-center justify-center w-full z-10 ">
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 660"
              strokeDashoffset="-330"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 220"
              strokeDashoffset="-110"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
      ) : (
        ""
      )}
      <div className="flex items-center justify-center">
      <div
        style={{ animation: "slideInFromLeft 1s ease-out" }}
        className="max-w-md h-screen w-full bg-gradient-to-r from-blue-800 to-purple-600 lg:rounded-xl shadow-2xl overflow-hidden p-8 space-y-8"
      >
        <h2
          style={{ animation: "appear 2s ease-out" }}
          className="text-center text-4xl font-extrabold text-white"
        >
          Welcome to MeetMe
        </h2>
        <p
          style={{ animation: "appear 3s ease-out" }}
          className="text-center text-gray-200"
        >
          create a new Account
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
            <input
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              value={cred.fullname}
              onChange={(e) => onChange(e)}
              id="fullname"
              name="fullname"
              type="text"
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="fullname"
            >
              Full Name
            </label>
          </div>
          <div className="relative">
            <input
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              value={cred.email}
              onChange={(e) => onChange(e)}
              id="email"
              name="email"
              type="email"
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="email"
            >
              Email address
            </label>
          </div>
          <div className="relative">
            <input
              placeholder="Password"
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              id="password"
              value={cred.password}
              onChange={(e) => onChange(e)}
              name="password"
              type="password"
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <input
              placeholder=""
              className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-purple-500"
              required
              id="contact"
              value={cred.contact}
              onChange={(e) => onChange(e)}
              name="contact"
              type="number"
            />
            <label
              className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <button
            className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
            type="submit"
          >
            Create
          </button>
        </form>
        <div className="text-center text-gray-300">
          Aleardy have an account?{" "}
          <Link className="text-purple-300 hover:underline" to="/login">
            Sign In
          </Link>
        </div>
      </div>
      </div>
    </div>
  </>
  );
};

export default Signup;
