
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http'
import * as WebSocket from 'ws';
import {Message} from '..//Spotifuse/src/app/pairing/Message'
//import {Artist} from './Spotifuse/src/app/pairing/Artist'

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


//current sessions
const sessions = new Map();
const clients = new Map();

wss.on('connection', (ws: WebSocket) => {

    
    let pin = Math.floor(Math.random() * Math.floor(999999));
    while(clients.has(pin)){
        pin = Math.floor(Math.random() * Math.floor(999999));
    }

    clients.set(pin,ws);
    


    ws.on('message', (message: string) => {
        let data = JSON.parse(message)
        
        if(data.type=="PAIR"){

        }
        else if (data.type=="TRACKS"){

        }
        else if (data.type=="PLAYLIST"){
            
        }

        
        ws.send(JSON.stringify({message: `hello you sent: ${message}`}))
        
    })

    ws.send(JSON.stringify(new Message("Server",pin,false)))

})



//enable cors
app.use(cors())



app.use(express.json());


app.post('/existingPin', (request, response) => {
    
   
    if(sessions.has(request.body.pin) && sessions.get(request.body.pin).user2Tracks == undefined){
        //tell client that pin exists and isnt used, should trigger an add tracks post
        response.status(200).send({paired: true});
    }
    else{
        response.status(200).send({paired:false});
    }
    


})

app.post('/sendTracks', (request, response) => {

    if(sessions.has(request.body.pin)&& sessions.get(request.body.pin).user2Tracks == undefined){

        sessions.get(request.body.pin).websocket.send(JSON.stringify(new Message("server",request.body.pin,true)))
        sessions.get(request.body.pin).user2Tracks = request.body.tracks;
        response.status(200).send({added: true})
       

    }else{
        response.status(200).send({added:false})
    }


})


function createNewPlaylist(pin: number){
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




server.listen(3000, () => console.log("Listening on port 3000"));