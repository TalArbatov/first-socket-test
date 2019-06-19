import React from 'react';
import io from 'socket.io-client';

const socketUrl = "http://localhost:4000";

class App extends React.Component {
    state = {
        socket: null,
        messages: [],
        currentMessage: ''
    }
    componentDidMount() {
        this.initSocket();
    }

    initSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log('connected');
            socket.emit('test', 'test from client')
            this.setState({socket})
        })
        socket.on('onMessageSuccess', (message) => {
            console.log('got in client message: ' + message)
            const messages = this.state.messages;
            this.setState({messages: [...messages, message]})
        })
    }   

    onInput = text => {
        this.setState({currentMessage: text})
    }
    onSubmit = () => {
        const { socket } = this.state;
        socket.emit('onMessage', this.state.currentMessage)
        

    }
    
    render() {
        return(
            <div>
                <h1>App</h1>
                <input type='text' onChange={(e) => {this.onInput(e.target.value)}}></input>
                <button onClick={() => this.onSubmit()}>Submit</button> 
                {this.state.messages.map((message, index) => {
                    return <p key={index}>{message}</p>
                })}
            </div>
        )
    }
}

export default App;