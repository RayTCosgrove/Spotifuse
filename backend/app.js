"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var http = require("http");
var WebSocket = require("ws");
var Message_1 = require("..//Spotifuse/src/app/pairing/Message");
//import {Artist} from './Spotifuse/src/app/pairing/Artist'
var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
//current sessions
var sessions = new Map();
wss.on('connection', function (ws, req) {
    //let url = new URL(req.url,'http://localhost:3000');
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
            console.log("pin is " + data.pin);
            if (sessions.has(data.pin)) {
                if (sessions.get(data.pin).user1Tracks == undefined) {
                    console.log('we added tracks my dude');
                    sessions.get(data.pin).user1Tracks = data.tracks;
                    createNewPlaylist(data.pin);
                }
            }
        }
        ws.send(JSON.stringify({ message: "hello you sent: " + message }));
    });
    ws.send(JSON.stringify(new Message_1.Message("Server", pin, false)));
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
function createNewPlaylist(pin) {
    /*
    //users tracks
    let user1 = sessions.get(pin).user1Tracks
    let user2 = sessions.get(pin).user2Tracks

    //list of trackId strings
    let playlist = new Set()

    //list of artistIds strings
    let commonArtists = new Set()

    //list of trackIds strings
    let commonSongs = new Set()

    for(let i = 0; i < user1.length; i ++){

        for(let j = 0; j<user2.length; j++){

            if(user1[i].id===user2[j].id){

                commonSongs.add(user1[i].id)

            }
            
            user1[i].artists.array.forEach((artist1: Artist) => {
                user2[j].array.forEach((artist2: Artist) => {
                    if(artist1.id===artist2.id){
                        commonArtists.add(artist1)
                        commonSongs.add(user1[i].id)
                        commonSongs.add(user2[j].id)
                    }
                });
            });

        }

    }





*/
}
server.listen(3000, function () { return console.log("Listening on port 3000"); });
