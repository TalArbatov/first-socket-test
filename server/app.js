const express = require('express');
const config = require('../config');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const mongoose =require('mongoose');

//config mongo
mongoose.connect(config.mongoURI, {useNewUrlParser: true}, (err) => {
    if(err) console.log(`Connection error to ${config.mongoURI}, Error: ${err}`);
})
require('./models/ChatSchema');

//config socketIO
const client = socketIO.listen(4000).sockets;
const Chat = mongoose.model('Chat');
client.on('connection', (socket) => {

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
    socket.on('onMessage', (message) => {
        console.log('got to server: ' + message)
        const newChat = new Chat({
            username: 'Tal',
            content: message,
            date: Date.now()
        })
        newChat.save((err, doc) => {
            if(!err) {
                //io.soc('onMessageSuccess', message)
                client.emit('onMessageSuccess', message)
            }
        })
    })

})


//config middlewares
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/', express.static(require('path').join(__dirname, '..', 'client', 'public')));

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`)
})
