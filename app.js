"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var http = require("http");
var WebSocket = require("ws");
var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

//current sessions
var sessions = new Map();
var clients = new Map();
wss.on('connection', function (ws) {
    var pin = Math.floor(Math.random() * Math.floor(999999));
    while (clients.has(pin)) {
        pin = Math.floor(Math.random() * Math.floor(999999));
    }
    clients.set(pin, ws);
    ws.on('message', function (message) {
        var data = JSON.parse(message);
        if (data.type == "PAIR") {
            console.log("PAIR");
            var pin_1 = data.pin;
            if (clients.has(pin_1)) {
                if (!sessions.has(pin_1)) {
                    //create new session here
                    var session = {
                        user1: clients.get(pin_1),
                        user2: clients.get(data.sender),
                        tracks: [],
                        pin: pin_1,
                        paired: true
                    };
                    console.log("creating session");
                    sessions.set(pin_1, session);
                    //let clients know they paired successfully
                    clients.get(pin_1).send(JSON.stringify({ type: 'PAIR', pin: pin_1 }));
                    if (pin_1 !== data.sender) {
                        console.log("sending to first client");
                        clients.get(data.sender).send(JSON.stringify({ type: 'PAIR', pin: pin_1 }));
                    }
                }
                else {
                    clients.get(data.sender).send(JSON.stringify({ type: 'ERROR', message: 'This pin has already been used. Please try again.' }));
                }
            }
            else {
                console.log("sending error");
                clients.get(data.sender).send(JSON.stringify({ type: 'ERROR', message: 'This pin does not exist. Please try again.' }));
            }
        }
        else if (data.type == "TRACKS") {
            console.log("TRACKS");
            console.log("session pin is " + data.pin);
            var session = sessions.get(data.pin);
            var newTracks = data.tracks;
            //add newTracks to session
            console.log(session);
            session.tracks = session.tracks.concat(newTracks);
            console.log("sessionlength " + session.tracks.length);
            if (session.tracks.length >= 40) {
                //send to client1
                clients.get(session.pin).send(JSON.stringify({ type: 'TRACKS', tracks: session.tracks, pin: session.pin }));
            }
        }
        else if (data.type == "PLAYLIST") {
            console.log("PLAYLIST");
            sessions.get(data.pin).user2.send(JSON.stringify({ type: 'PLAYLIST', playlist: data.playlist, pin: pin }));
        }
        ws.send(JSON.stringify({ message: "hello you sent: " + message }));
    });
    ws.send(JSON.stringify({ type: "PIN", pin: pin }));
});
//enable cors
app.use(cors());
app.use(express.json());
server.listen(process.env.PORT || 3000, function () { return console.log("Listening on port 3000"); });
