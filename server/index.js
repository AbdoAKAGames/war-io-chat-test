import { createServer } from "http"
import { Server } from "socket.io"


const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["https://war-io-chat-test.vercel.app/app/", "https://war-io-chat-test.vercel.app/app/"]
    }
})
io.on('connection', socket => {
    socket.on('message', (data, room) => {
        if (room === '') {
            io.emit('message', {msg: `${data.username}: ${data.msg}`, username: data.username});
        } else {
            socket.to(room).emit('message', {msg: `${data.username}: ${data.msg}`, username: data.username});
            socket.emit('message', {msg: `${data.username}: ${data.msg}`, username: data.username});
        }
    })
    socket.on('username', username => {
        socket.username = username;
        io.emit('message', {msg: `${socket.username} just joined the group`, username: 'sys',});
        socket.on('disconnect', () => {
            io.emit('message', {msg: `${username} has left the group`, username: 'sys'});
        })
    })
    socket.on('join-room', room => {
        socket.join(room);
        socket.to(room).emit('message', {msg: `${socket.username} just joined to room: ${room}`, username: 'sys'});
    })
})


httpServer.listen(3000, () => console.log('listening on port 3500'));
