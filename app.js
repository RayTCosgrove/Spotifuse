"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var http = require("http");
var WebSocket = require("ws");
var Message_1 = require("..//Spotifuse/src/app/pairing/Message");
//import {Artist} from './Spotifuse/src/app/pairing/Artist'
var app = express();
// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
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
app.post('/existingPin', function (request, response) {
    if (sessions.has(request.body.pin) && sessions.get(request.body.pin).user2Tracks == undefined) {
        //tell client that pin exists and isnt used, should trigger an add tracks post
        response.status(200).send({ paired: true });
    }
    else {
        response.status(200).send({ paired: false });
    }
});
app.post('/sendTracks', function (request, response) {
    if (sessions.has(request.body.pin) && sessions.get(request.body.pin).user2Tracks == undefined) {
        sessions.get(request.body.pin).websocket.send(JSON.stringify(new Message_1.Message("server", request.body.pin, true)));
        sessions.get(request.body.pin).user2Tracks = request.body.tracks;
        response.status(200).send({ added: true });
    }
    else {
        response.status(200).send({ added: false });
    }
});
server.listen(3000, function () { return console.log("Listening on port 3000"); });