const express = require('express');
const server = require('http').createServer();
const app = express();

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });

});

server.on('request', app);
server.listen(3000, function () {
    console.log('Server started on port 3000');
});

//! begin websocket

const websocketServer = require('ws').Server;

const wss = new websocketServer({ server: server });

wss.on('connection', function connection(ws) {
    const numClients = wss.clients.size;
    console.log('Client connected. Total clients: ' + numClients);

    wss.broadcast('Total clients: ' + numClients);

    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to the server!');
    };

    ws.on('close', function close() {
        console.log('Client disconnected');
        wss.broadcast('Total clients: ' + numClients);
    });

});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        // if (client.readyState === client.OPEN) {
            client.send(data);
        // }
    });
}