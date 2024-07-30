import React from "react";
import { useState } from "react";
import appContext from "../context/AppContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import socket from "../socket";

const Login = () => {
  const [cred, setcred] = useState({ email: "", password: "" });
  const { setAlert } = useContext(appContext);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
 
  
  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_HOST}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cred.email, password: cred.password }),
        credentials: "include", // This ensures cookies are included in the request
      });
      const data = await response.json();
      if (data.success) {
        let token = getCookie("token");
        if (token) {
          setcred({ email: "", password: "" });
          socket.emit("login", data.userid);
          setLoader(true);
          setAlert(true);
          setTimeout(() => {
            setLoader(false);
            navigate("/");
            setTimeout(() => {
              setAlert(false);
            }, 1500);
          }, 3000);
        } else {
          setAlert({ bool: true, message: "Login successful but no token found" });
          setTimeout(() => {
            setAlert({ bool: false, message: "" });
          }, 1000);
        }
      } else {
        setAlert({ bool: true, message: "Invalid Details" });
        setTimeout(() => {
          setAlert({ bool: false, message: "" });
        }, 1000);
        setcred({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({ bool: true, message: "An error occurred during login. Please try again." });
      setTimeout(() => {
        setAlert({ bool: false, message: "" });
      }, 2000);
    }
  };
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }
  
  const onChange = (e) => {
    setcred({ ...cred, [e.target.name]: e.target.value });
  };
  
  return (
    <>
      <div className="relative">
        {loader ? (
          <div className="loader bg-black opacity-70 absolute min-h-screen flex items-center justify-center w-full z-10 ">
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
              Sign in to your account
            </p>
            <form onSubmit={login} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-200">
                  <input
                    className="form-checkbox h-4 w-4 text-purple-600 bg-gray-800 border-gray-300 rounded"
                    type="checkbox"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a className="text-sm text-purple-200 hover:underline" href="#">
                  Forgot your password?
                </a>
              </div>
              <button
                className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
                type="submit"
              >
                Sign In
              </button>
            </form>
            <div className="text-center text-gray-300">
              Don't have an account?{" "}
              <Link className="text-purple-300 hover:underline" to="/signup">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
{
}
export default Login;
