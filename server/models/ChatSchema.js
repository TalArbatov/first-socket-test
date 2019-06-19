const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    username: String,
    content: String,
    date: Date
})

mongoose.model('Chat', ChatSchema)