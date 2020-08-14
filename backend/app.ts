
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http'
import * as WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


//current sessions
const sessions = new Map();

wss.on('connection', (ws: WebSocket) => {

    let pin = Math.floor(Math.random() * Math.floor(999999));
    while(sessions.has(pin)){
        pin = Math.floor(Math.random() * Math.floor(999999));
    }

    sessions.set(pin,{
        websocket: ws,
        user1Tracks: undefined,
        user2Tracks: undefined, 
    })


    ws.on('message', (message: string) => {
        let data = JSON.parse(message)
        if(data.pin){
            if(sessions.has(pin)){
                if(sessions.get(pin).user1Tracks===undefined){
                    console.log('we added tracks my dude')
                    sessions.set(pin,{
                        websocket: ws,
                        user1Tracks: data.tracks,
                        user2Tracks: undefined
                    })
                }
            }
        }

        console.log('received: %s', message)
        ws.send(`hello you sent: ${message}`)
        console.log(sessions)
    })

    ws.send(JSON.stringify({pin}))

})



//enable cors
app.use(cors())



app.use(express.json());


app.post('/existingPin', (request, response) => {
    
   

    response.status(200).send({message:'getting existing pin'});


})






server.listen(3000, () => console.log("Listening on port 3000"));