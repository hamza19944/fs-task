import { useEffect, useState } from "react";
import "./topics.css"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"

import io from "socket.io-client";

const socket = io.connect("http://localhost:8008")

const Topics = ({ setMessages, username, setUsername, room, setRoom, setSocket, logged, setRoomID, roomID }) => {
    const [data, setdata] = useState([])
    const [token, setToken] = useState("")
    const navigate = useNavigate()
    setSocket(socket)

    const fetchData = async () => {
        let tk = JSON.parse(localStorage.getItem("login"))
        let topics = JSON.parse(localStorage.getItem("topics"));
        if(topics) {
            setdata(JSON.parse(localStorage.getItem("topics")));
        }else{
            const res =  await fetch(`http://localhost:8008/topics/${tk?.user?.login}%20${tk?.token}`, {
                method: "POST",
                headers:{
                  Authorization: "Bearer " + tk.token
                },
                body: localStorage.getItem("login")
            }).then(res => res.json()).then(dt => {
                setdata(dt)
                JSON.stringify(localStorage.setItem("topics", JSON.stringify(dt)))
            }).catch(err => console.log(err))
        }
    }
    useEffect(() => {
        fetchData();
        let topics = JSON.parse(localStorage.getItem("topics"));
    }, [logged])
    
    // joining a chat room related to subject
    const joinRoom = () => {
        if(room !== "" && username !== "") {
            socket.emit('join_room', {roomID, username, room})
        }

        // redirect to the /chat (chat room)
        navigate('/chat', {replace: true})
    }

    // handle the chat page
    const handleChat = async (e, id) => {
        const userLogin = JSON.parse(localStorage.getItem("login"))
        setUsername(userLogin?.user?.login)
        setRoom(e.target.innerText)
        setRoomID(id)
        try {
            const res = await fetch(`/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + userLogin.token
                },
                body: JSON.stringify({
                    login: userLogin.user.login, topics: e.target.innerText
                })
            }).then(res => res.json()).then(dt => dt)
            setMessages({
                topics: e.target.innerText, results: res
            })
        } catch (error) {
            console.log("error: ", error);
        }
    }

    if(logged){
        if(typeof data !== "string" && data?.length !== 0){
            return (
                <div className="topics">
                    {data?.map(topic => <h3 className="topic" key={topic.id} onClick={(e) => {handleChat(e, topic.id); joinRoom()}}>{topic.topics}</h3>)}
                </div>
            )
        }else{
            return <h3 className="topic">Loading...</h3>
        }
    }
}
 
export default Topics;