import { useEffect, useState } from "react"
import "./chat.css"

const Chat = ({ messages, socket, username, room, logged, roomID }) => {
    const [smessages, setSMessages] = useState([])
    const [recmessagesTo, setRecMessagesTo] = useState([])
    const [rmsg, setRmsg] = useState([])
    const [smsg, setSmsg] = useState([])
    const [jmsg, setJmsg] = useState("")
    const [newArrayofMsgs, setNewArrayofMsgs] = useState([])
    const [oneMsg, setOneMsg] = useState("")
    const [dataSent, setDataSent] = useState(false)

    const handleMsgs = () => {
        setSMessages(messages?.results?.result?.messages);
        setRecMessagesTo(messages?.results?.result?.messagesTo);
    }
    useEffect(() => {
        setNewArrayofMsgs([])
        handleMsgs();
        receiveMessage()
        document.querySelector(".dialo-box").scrollTo(0, document.querySelector(".dialo-box").scrollHeight)
    }, [])
    useEffect(() => {
        !dataSent && setNewArrayofMsgs((prev) => {
            let theseMsgs = [...prev, oneMsg]
            return theseMsgs.filter(msg => msg !== "")
        })
        setDataSent(false)
        document.querySelector(".dialo-box").scrollTo(0, document.querySelector(".dialo-box").scrollHeight)
    }, [oneMsg])
    const receiveMessage = () => {
        socket?.on("receive_message", (data) => {
            setRmsg((prev) => [...prev, {
                id: roomID,
                login: data.login,
                message: data.message
            }])
        })
        socket?.on("join_message", (data) => {
            setJmsg({
                message: data.message,
                login: data.login
            })
        })
        return () => {socket.off('receive_message'); socket.off('join_message')};
    }

    const sendMessage = async () => {
        setDataSent(true)
        socket.emit('send_message', {id: roomID, username, smsg});
        setSmsg("")
        await socket?.on("chat_message", (data) => {
            setOneMsg(data)
        })
        return () => socket.off('chat_message');
    }
    
    const MessageComp = ({ oneMsg, newArrayofMsgs }) => {
        useEffect(() => {document.querySelector(".dialo-box").scrollTo(0, document.querySelector(".dialo-box").scrollHeight)}, [])
        return oneMsg && newArrayofMsgs?.map((chatMsg) => (
            <span className="sender" id={chatMsg.id}>{chatMsg.message}</span>
        ))      
    }

    if(logged){
        return (
            <div className="chat-box">
                <h2>{messages.topics}</h2>
                <div className="dialo-box" >
                    {
                        messages && recmessagesTo?.map((basermsg) => (
                            <span className="rece" id={basermsg.id}>{basermsg.message}</span>
                        ))
                    }
                    {
                        messages && smessages?.map((basesmsg) => (
                            <span className="sender" id={basesmsg.id}>{basesmsg.message}</span>
                        ))
                    }
                    <div className="msg-admin">
                        <span className="admin" id={rmsg[0]?.id}>{rmsg[0]?.message}</span>
                        <p>{rmsg[0]?.login}</p>
                    </div>
                    <div className="join-message">
                        <span className="join">{jmsg.message}</span>
                    </div>
                    <MessageComp oneMsg={oneMsg} newArrayofMsgs={newArrayofMsgs} />
                </div>
                <div className="typing" >
                    <textarea name="" id="" cols="30" rows="2" onChange={(e) => setSmsg(e.target.value)}  value={smsg}></textarea>
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        );
    }
}
 
export default Chat;