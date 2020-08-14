"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var http = require("http");
var WebSocket = require("ws");
var Message_1 = require("..//Spotifuse/src/app/pairing/Message");
var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
//current sessions
var sessions = new Map();
wss.on('connection', function (ws) {
    console.log(ws);
    var pin = Math.floor(Math.random() * Math.floor(999999));
    while (sessions.has(pin)) {
        pin = Math.floor(Math.random() * Math.floor(999999));
    }
    sessions.set(pin, {
        websocket: ws,
        user1Tracks: undefined,
        user2Tracks: undefined
    });
    ws.on('message', function (message) {
        var data = JSON.parse(message);
        if (data.pin) {
            if (sessions.has(pin)) {
                if (sessions.get(pin).user1Tracks === undefined) {
                    console.log('we added tracks my dude');
                    sessions.set(pin, {
                        websocket: ws,
                        user1Tracks: data.tracks,
                        user2Tracks: undefined
                    });
                }
            }
        }
        console.log('received: %s', message);
        ws.send("hello you sent: " + message);
        console.log(sessions);
    });
    ws.send(JSON.stringify(new Message_1.Message("Server", pin, false)));
});
//enable cors
app.use(cors());
app.use(express.json());
app.post('/existingPin', function (request, response) {
    if (sessions.has(request.body.pin)) {
        sessions.get(request.body.pin).websocket.send(JSON.stringify(new Message_1.Message("server", request.body.pin, true)));
    }
    response.status(200).send({ message: 'getting existing pin' });
});
console.log("testingsdfsf");
server.listen(3000, function () { return console.log("Listening on port 3000"); });
