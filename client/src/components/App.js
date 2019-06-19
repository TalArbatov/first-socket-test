import React from 'react';
import io from 'socket.io-client';
import constants from '../../../constants'
import Login from './Login'


const socketUrl = "http://localhost:4000";

class App extends React.Component {
    state = {
        colors: ['blue','red','orange','purple','brown', 'cyan', 'grey'],
        socket: null,
        messages: [],
        userState: {
            isLogged: false,
            nickname: 'Default User',
            color: 'black',
            message: '',
        }
    }
    componentDidMount() {
        this.initSocket();
    }

    initSocket = () => {
        const socket = io(socketUrl);
        socket.on('connect', () => {
            console.log('connected');
            socket.emit('connectionStart', 'test from client')
            this.setState({socket})
        })

        socket.on(constants.GET_INITIAL_STATE, (messages) => {
            console.log(messages);
            this.setState({messages})
        })
        socket.on(constants.ON_MESSAGE_RECIEVED, (message) => {
            console.log('got in client message: ');
            console.log(message)
            const messages = this.state.messages;
            this.setState({messages: [message,...messages, ]})
        })
    }   

    onInput = text => {
        const userState = {...this.state.userState, message: text}
        this.setState({userState})
    }
    onSubmit = () => {
        const { socket } = this.state;
        socket.emit(constants.ON_MESSAGE_SENT, this.state.userState)
        

    }

    enter = nickname => {
        const index = Math.floor(Math.random() * 6);
        console.log(index);

        const userState = {
            isLogged: true,
            nickname: nickname,
            color: this.state.colors[index]
        }
        console.log(userState)
        this.setState({userState})
    }
    
    render() {
        const messages = this.state.messages.map((message, index) => {
            return <p key={index}><text style={{fontWeight:'800', color: `${message.color}`}}>{`${message.nickname}: `}</text>{message.message}</p>
        })

        if(this.state.userState.isLogged) {
            return(
            <>
            <h1>App</h1>
            <input type='text' onChange={(e) => {this.onInput(e.target.value)}}></input>
            <button onClick={() => this.onSubmit()}>Submit</button> 
            {messages}
            </>
            )
        }
        else {
            return <Login enter={(nickname) => this.enter(nickname)}/>;
        }
        
        
    }
}

export default App;