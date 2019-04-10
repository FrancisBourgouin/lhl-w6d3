import React, { Component } from 'react';
import './App.css';
import HeaderNav from './HeaderNav';

class App extends Component {
  constructor(props) {
    super(props);

    // State will contain info (id, username, color)
    this.state = {
      currentUser: {
        id: null,
        username: '',
        color: '#000',
      },
    };
  }

  // Event handler triggered when the client connects to the server
  handleOnOpen = evt => {
    console.log('client connected');
  };

  // Event handler if there is an error
  handleOnError = evt => {
    console.log('Error connecting to websocket');
  };

  // Event that receives the messages coming from socket server
  handleOnMessage = evt => {
    // Parse the incoming message. data is acutally in evt.data
    const incomingMessage = JSON.parse(evt.data);

    // Object format of the message
    //    {
    //      username: 'Anonymous1'
    //      type: 'incomingClientInfo'
    //    }

    // decide what to do depending on the type of message
    switch (incomingMessage.type) {
      // Receiving client info from the server
      case 'incomingClientInfo':
        // getting username from the message object
        const { id, username, color } = incomingMessage;
        //updating the state with username
        this.setState({
          currentUser: { ...this.state.currentUser, id, username, color },
        });
        break;

      // Getting a notification message from the server
      case 'incomingNotification':
        // You should call a function to handle the notification
        //addNotification(incomingMessage);
        console.log(incomingMessage);
        break;

      default:
        console.log('Unknown type of message');
    }
  };

  // Sending an outgoing message to the server
  sendNotification = message => {
    const outgoingMsg = {
      type: 'postNotification',
      message,
    };

    // send is a built-in method on the socket to send the message to the server
    this.socket.send(JSON.stringify(outgoingMsg));
  };

  // Updating the username in the state and
  // sending a notification to server
  updateUsername = username => {
    const message = `${
      this.state.currentUser.username
    } has changed its name to ${username}`;
    // Send a notifaction to the server
    // update the state of App with this new username
    this.sendNotification(message);
    // update the state
    this.setState({
      currentUser: { ...this.state.currentUser, username: username },
    });
  };

  componentDidMount() {
    const socketUrl = 'ws://localhost:3001';

    // Creating a new websocket
    this.socket = new WebSocket(socketUrl);

    // Assign the event handlers on this socket
    // onopen, onmessage, onerror
    this.socket.onopen = this.handleOnOpen;

    this.socket.onmessage = this.handleOnMessage;

    this.socket.onerror = this.handleOnError;
  }

  render() {
    return (
      <HeaderNav
        username={this.state.currentUser.username}
        color={this.state.currentUser.color}
        updateUsername={this.updateUsername}
      />
    );
  }
}

export default App;
