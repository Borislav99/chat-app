// --- IMPORTI ---
const express = require('express')
const path = require('path');
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words');
const { generateMessage } = require('./utils/messages');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')
// --- IMPORTI ---
// --- VARIJABLE ---
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const publicDir = path.join(__dirname, '../public')
const port = process.env.PORT || 3000
// --- VARIJABLE ---
// --- SETUP SERVERA ---
app.use(express.static(publicDir))
io.on('connection', (socket)=>{
    // join
    socket.on('join', ({username,room}, callback)=>{
        const {error, user} = addUser({id:socket.id, username, room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('admin', 'Welcome to the app!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('admin', `${user.username} joined the room`))
        io.to(user.room).emit('roomData', {
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    // join
    socket.on('sendMessage', (val, callback)=>{
        const filter = new Filter()
        if(filter.isProfane(val)){
            return callback('Dont use bad words')
        }
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, val))
        callback()
    })
    // posalji svima lokaciju korisnika
    socket.on('sendLocation', ({latitude, longitude}={}, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateMessage(user.username,`https://www.google.com/maps?q=${latitude},${longitude}`))
        callback()
    })
    // kada se klijent odjavi
    socket.on('disconnect', ()=>{
    const user = removeUser(socket.id)
    if(user) {
        io.to(user.room).emit('message', generateMessage('admin', `${user.username} disconnected`))
        io.to(user.room).emit('roomData', {
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    }
    })
})
// --- SETUP SERVERA ---
// --- POKRENI SERVER ---
server.listen(port, ()=>{
    console.log('server started');
})
// --- POKRENI SERVER ---