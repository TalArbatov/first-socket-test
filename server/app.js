const express = require('express');
const config = require('../config');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose =require('mongoose');
const constants = require('../constants');
const http = require('http')
//config mongo
mongoose.connect(config.mongoURI, {useNewUrlParser: true}, (err) => {
    if(err) console.log(`Connection error to ${config.mongoURI}, Error: ${err}`);
})
require('./models/ChatSchema');


const app = express();
const server = http.createServer(app);

//config socketIO
const client = socketIO(server).sockets;

//const client = socketIO.listen(4000).sockets;

const Chat = mongoose.model('Chat');
client.on('connection', async (socket) => {
    const Chats = await Chat.find({});
    //const messages = Chats.map(chat => chat.content)
    //client.emit(constants.GET_INITIAL_STATE, messages)
    const sendStatus = (status) => {
        socket.emit('status', status)
    }

    Chat.find({}, (err, docs) => {
        if(err) socket.emit('error', err)
        else socket.emit('output', docs)
    })
    socket.on('input', (data) => {
        const {username, content} = data;
        const newChat = new Chat({
            username,
            content,
            date: Date.now()
        });
        //validate credentials
        if(username === '' || content === '')
            sendStatus('Username or content is invalid')
        newChat.save((err, doc) => {
            if(err) sendStatus('Problem saving new message in chat')
        })
    })

    socket.on('clear', (messageID) => {
        Chat.findByIdAndDelete(messageID, (err, res) => {
            if(err) sendStatus('Error while removing chat message')
            else socket.emit('cleared')
        })
    })
    socket.on('test', (message) => {
        console.log(message)
    })
    socket.on(constants.ON_MESSAGE_SENT, (userState) => {
        console.log('got to server: ');
        console.log*userState
        const newChat = new Chat({
            username: userState.nickname,
            content: userState.message,
            date: Date.now()
        })
        newChat.save((err, doc) => {
            if(!err) {
                //io.soc('onMessageSuccess', message)
                client.emit(constants.ON_MESSAGE_RECIEVED, userState)
            }
        })
    })

})


//config middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', express.static(require('path').join(__dirname, '..', 'client', 'public')));

server.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`)
})
