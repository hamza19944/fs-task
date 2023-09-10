import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./scene/login/Login";
import Chat from "./scene/chat/Chat";
import Home from "./Home";
import Topics from "./scene/topics/Topics"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react";


function App() {
  const [messages, setMessages] = useState("")
  const [logged, setLogged] = useState(false)
  const [token, setToken] = useState("")
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [roomID, setRoomID] = useState('');
  const [socket, setSocket] = useState({})
useEffect(() => {

  const getUser = JSON.parse(localStorage.getItem("login"))
  if(getUser === "string" || getUser === null) {
    setLogged(false)
    setToken("")
  }else{
    setLogged(true)
    setToken(getUser)
  }
}, [logged])
  return (
    <Router>
      <Header user={token} logged={logged} setToken={setToken} setLogged={setLogged}/>
      <div className="app">
        {
          logged ? 
          (<Routes>
            <Route exact path="/auth" element={<Login setToken={setToken} setLogged={setLogged} />} />
            <Route path="/" element={<Home />}/>
            <Route 
              path="/topics/:user" 
              element={
                <Topics 
                  setMessages={setMessages}
                  username={username}
                  setUsername={setUsername}
                  room={room}
                  setRoomID={setRoomID}
                  roomID= {roomID}
                  setRoom={setRoom}
                  setSocket={setSocket}
                  logged={logged}
                  />
                }   
              />
            <Route 
              path="/chat" 
              element={
                <Chat 
                  messages={messages}
                  username={username} 
                  roomID= {roomID}
                  room={room} 
                  socket={socket}
                  logged={logged}
                />
              } 
            />
          </Routes>) : <Login setToken={setToken} setLogged={setLogged} />
        }
      </div>
      <Footer />
    </Router>
  );
}

export default App;
