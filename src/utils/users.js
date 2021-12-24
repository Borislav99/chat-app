const { get } = require("express/lib/response")

const users = []
// add user
const addUser = ({id,username,room})=>{
    // ocisti podatke -> lowercase, trim, nema praznog prostora
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username||!room) {
        return {
            error:'Username and room are required'
        }
    }
    // ime je unikatno
    const existingUser = users.find((item)=>{
        return item.room===room && item.username === username
    })
    // ako ime postoji
    if(existingUser){
        return {
            error:'Username is in use'
        }
    }
    // store user
    const user = {id, username, room}
    users.push(user)
    return {
        user
    }
}
// remove user
const removeUser = (id)=>{
    const index = users.findIndex(item=>{
        return item.id==id
    })
    if(index!==-1) {
        return users.splice(index,1)[0]
    }
}
const getUser = (id)=>{
    const user = users.find(item=>{
        return item.id==id
    })
    if(user==undefined){
        return undefined 
    }
    return user
}
const getUsersInRoom = (room)=>{
    const list = users.filter(item=>{
        return item.room == room
    })
    return list
}
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}