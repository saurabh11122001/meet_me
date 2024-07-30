import React, { useContext, useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Loader from './Loader';
import Stories from "./Stories";
import Postcontainer from './Postcontainer';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import appContext from '../context/AppContext';
import socket from '../socket';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAlert, getUser,user} = useContext(appContext);
  const [posts, setPosts] = useState([]);
  const host = process.env.REACT_APP_HOST;
  const scrollRef = useRef(null);

 
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const checkUser = async () => {
      try {
        await getUser();
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();
  }, [navigate, getUser]);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  useEffect(() => {
    if (!scrollRef.current) return;

    const locomotiveScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });

    return () => {
      if (locomotiveScroll) locomotiveScroll.destroy();
    };
  }, [scrollRef]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`${host}/auth/allpost`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Error fetching posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPost();
  }, [posts]);

  return (
    <>
      <div className="relative h-screen" ref={scrollRef} data-scroll-container>
        <div data-scroll>
          {isAlert && <Alert />}
          <Navbar />
          <Loader />
          <Stories />
          {posts.length > 0 && <Postcontainer posts={posts} />}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
