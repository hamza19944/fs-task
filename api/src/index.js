import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import user_routes from "./handlers/user.js"
import { Server } from "socket.io"
import http from "http"
import client from "../db.js"

const app = express()
const port = process.env.PORT || 8008;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods: ['GET', 'POST'],
    },
})

const CHAT_BOT = 'CHAT_BOT'; 
io.on("connection", (socket) => {
    // console.log(`User connected ${socket.id}`);
    socket.on('join_room', async (data) => {
        const {roomID, username, room} = data
        let roomName = "room" + roomID
        socket.join(roomName)

        io.to(roomName).emit("join_message", {
            id: roomID,
            login: CHAT_BOT,
            message: username + " has joined the chat room",
        })

        // Send welcome msg to user that just joined chat only
        socket.emit('receive_message', {
            id: roomID,
            login: CHAT_BOT,
            message: `Welcome ${username}`,
        })

        socket.on("send_message", async (data) => {
            const { id, username, smsg} = data;
            io.to(roomName).emit('chat_message', { id, username, message: smsg})
            // editing the database
            try {
                const connection = await client.getConnection();
                const sql = 'INSERT INTO messages (login, topics, message) VALUES (?,?,?);';
                const result = await connection.query(sql, [username, room, smsg]);
                // client.end()
                return null;
            } catch (error) {
                throw new Error(
                  `Failed to sign in as user with the following error: ${error}`
                );
            }
        })
    });
})
user_routes(app)

// io.listen(port)
server.listen(port, () => {
    console.log("Server is running on port " + port);
})

export default app;