
import Home from "./components/Home";
import Inbox from "./components/Inbox";
import Myprofile from "./components/Myprofile";
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Search from "./components/Search";
import Upload from "./components/Upload";
import socket from "./socket";
import ChatPage from "./components/Chatpage";
import Notification from "./components/Notification";
import Friends from "./components/Friends";
import Friendreq from "./components/Friendreq";
import InbChat from "./components/Inbox&Chatpage/InbChat";
import Chatpage2 from "./components/Inbox&Chatpage/Chatpage2";
function App() {

  return (
    <>      
          <div>
        <Router>
        <Routes>
          <Route path="/login" element={ <Login/>}/>
          <Route path="/signup" element={ <Signup/>}/>
          <Route path="/search" element={ <Search/>}/>
          <Route path="/upload" element={ <Upload/>}/>
          <Route path='/friends'element={<Friends/>}/>
          <Route path="/notification" element={ <Notification/>}/>
          <Route path="/friendreq" element={ <Friendreq/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/inbox" element={<Inbox/>}/>
          <Route path="/profile" element={<Myprofile/>}/>
          <Route path="/chatpage/:id" element={<ChatPage/>}/>
          <Route path="/InbChat" element={<InbChat/>}/>
        </Routes>
        </Router>
        </div>
    </>
  );
}

export default App;
