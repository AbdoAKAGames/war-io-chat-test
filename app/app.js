const socket = io('https://war-io-chat-test.vercel.app/app/')
const username = prompt('what is your name');
const joinRoomBtn = document.getElementById('join');
const joinInp = document.getElementById('joinInp');
function sendMessage(e) {
    e.preventDefault();
    const input = document.querySelector('input')
    const room = joinInp.value;
    if (input.value) {
        socket.emit('message', {msg: input.value, username: username}, room)
        input.value = ""
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)

    joinRoomBtn.addEventListener("click", () => {
        const room = joinInp.value;
        socket.emit('join-room', room);
    })

// Listen for messages 
socket.on("message", data => {
    const li = document.createElement('li');
    li.innerHTML = data.msg + `<span>${new Date().getHours()}:${new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : new Date().getMinutes()}${new Date().getHours() > 11 ? ' PM' : ' AM'}</span>`;
    if (data.username === username) {
        li.className = 'out';
    } else if (data.username === 'sys') {
        li.className = 'sys';
    } else {
        li.className = 'in';
    }
    document.querySelector('ul').appendChild(li);
})



if (username) {
    socket.emit('username', username)
} else {
    location.reload();
}
