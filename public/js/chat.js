const socket = io()
// Elements
const form = document.querySelector(".msg")
const formButton = form.querySelector('.submit')
const button = document.querySelector(".location")
// messages
const messages = document.querySelector('#messages')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#message-location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
// options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})
// messages
socket.on('message', ({username,text, createdAt})=>{
    createdAt = moment(createdAt).format('h:mm a')
    const html = Mustache.render(messageTemplate, {username, message:text, createdAt})
    messages.insertAdjacentHTML('beforeend', html)
})
// location
socket.on('locationMessage', ({username,text, createdAt})=>{
    createdAt = moment(createdAt).format('h:mm a')
    const html = Mustache.render(locationTemplate, {username, message:text, createdAt})
    messages.insertAdjacentHTML('beforeend', html)
})
// number of clients
socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {room, users})
    document.querySelector('#sidebar').innerHTML = html
})
// form event
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    const val = document.querySelector('.input').value
    // disable form
    formButton.setAttribute('disabled', 'disabled')
    // disable form
    socket.emit('sendMessage', val, (value)=>{
        formButton.removeAttribute('disabled')
        // clear form
        form.querySelector('.input').value = ""
        // clear form
        // set focus
        form.querySelector('.input').focus()
        // set focus
        if(value){
            return console.log(value);
        }
        console.log('Delivered')
    })
})
// button clicked
button.addEventListener('click', ()=>{
    // disable
    button.setAttribute('disabled', 'disabled')
    // disable
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser")
    }
    // dobijanje lokacije
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        }, (value)=>{
        // disable
        button.removeAttribute('disabled')
        // disable
            if(value) {
                return console.log(value)
            }
            console.log('Location shared')    
        })
    })
})
// emit event
socket.emit('join', {username, room}, (error)=>{
    if(error) {
        alert(error)
        location.href = '/'
    }
})