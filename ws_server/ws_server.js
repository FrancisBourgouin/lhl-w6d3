const express = require('express');
const SocketServer = require('ws');
const uuidv4 = require('uuid');

const PORT = process.env.port || 3001;
const app = express();

const server = app.listen(PORT, () =>
  console.log(`Server listening on PORT: ${PORT}`)
);

const wss = new SocketServer.Server({ server });

const clientList = {};

// Generate a random hex color
const getColor = () => {
  return `#${uuidv4().slice(0, 6)}`;
};

// Add client info to clientList to keep track of the client
// client is the socket instance of that client
// clientInfo is the object containing id, username, color
const addClient = (client, clientInfo) => {
  // Adding a new entry into the clientList object
  clientList[clientInfo.id] = {
    id: clientInfo.id,
    username: clientInfo.username,
    color: clientInfo.color,
  };

  // Keeping the id on the instance of the ws client
  client.id = clientInfo.id;
};

const connectClient = (client, nbClients) => {
  const clientId = uuidv4();

  // Creating a message object containing the client info
  const infoMsg = {
    id: clientId,
    username: `Anonymous${nbClients}`,
    color: getColor(),
    type: 'incomingClientInfo',
  };

  // Adding the client info to the clientList object
  addClient(client, infoMsg);

  // Sending back to client the id, username, and color
  client.send(JSON.stringify(infoMsg));
};

// Broadcasting a message to all clients. Disable the if statement
// if it causes you problem

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    //if (client.readyState === SocketServer.OPEN) {
    client.send(data);
    //}
  });
};

wss.on('connection', ws => {
  // Triggered every time a new client connects
  connectClient(ws, wss.clients.size);
  console.log(clientList);

  // When a client sends a message
  ws.on('message', msg => {
    // incoming message needs to parsed
    const clientMsg = JSON.parse(msg);

    // do something according to the message type
    switch (clientMsg.type) {
      case 'postNotification':
        // adding an id and a type to the message and send it back
        clientMsg.type = 'incomingNotification';
        clientMsg.id = uuidv4();
        wss.broadcast(JSON.stringify(clientMsg));

        break;
      default:
        console.log('unknow message type');
    }
  });

  // executed when the client disconnect
  ws.on('close', () => console.log('client disconnected'));
});
