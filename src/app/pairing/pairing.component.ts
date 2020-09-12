import { Component, OnInit } from '@angular/core';
import { PairingService } from './pairing.service'
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';





@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss']
})
export class PairingComponent implements OnInit {

  public pin = 0;
  public pinInput;
  public newPin = false;
  public existingPin = false;
  public isPaired = false;
  private socket;
  public errorMessage = "";

  constructor(private pairing: PairingService, private auth: SpotifyAuthService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  generateNewPin(){
    this.newPin=true;
    this.socket = this.pairing.generateNewPin();
    this.socket.subscribe(
      (message) => {
        if(message.type == "ERROR"){
          this.errorMessage = message.message;
          this.pinInput = "";
        }
        else if(message.type=="PIN"){
          //save generated uid as pin
          this.pin = message.pin;
          console.log(this.pin)
          sessionStorage.setItem('spotifusePin',this.pin.toString())
        }
        else if(message.type=="PAIR"){
          //send TRACKS message with getTracks() list of tracks
          this.isPaired = true;
          this.pairing.setPaired(true);
                    this.socket.next({type: 'TRACKS',pin: this.pin, tracks: this.auth.getTracks()});
          console.log("sent tracks")
        }
        else if(message.type=="TRACKS"){
          console.log("got tracks");

          let tracks = message.tracks
          let refinedTracks = new Set()
          let artists = new Set()
          for(let i = 0; i < tracks.length; i++){

            //add all songs to set so no duplicates
            refinedTracks.add(tracks[i].uri)
            for(let j = 0; j < tracks.length; j++){

              //check all the artists of all the songs and look for mutuals
              for(let artist1 = 0; artist1 < tracks[i].artists.length; artist1++){
                for(let artist2 = 0; artist2 < tracks[j].artists.length; artist2++){
                  if(tracks[i].artists[artist1].id==tracks[j].artists[artist2].id){
                    artists.add(tracks[i].artists[artist1].uri)
                  }
                }
              }


            }
          }

          console.log(Array.from(refinedTracks))


          //create collab playlist
          this.auth.createPlaylist(<string[]>Array.from(refinedTracks), this.socket, this.pin).subscribe((response) =>
          {

            console.log("accesstoken--------------------")
            console.log(this.auth.getAccessTokenString())
            console.log("accesstoken--------------------")

            this.http.post('https://api.spotify.com/v1/playlists/'+response.id+'/tracks',{'uris': <string[]>Array.from(refinedTracks)},{
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.auth.getAccessTokenString() }).set('Content-Type', 'application/json'),
            }).subscribe((snapshotId) => {
              console.log(snapshotId)
              this.socket.next({type: 'PLAYLIST',pin: this.pin, playlist: response.id});
              this.auth.getPlaylistItems(response.id)
            })

          })






          //get recs from spotify api

          //add songs with spotify api

          //send playlist id to server

          //display playlist

          //close socket
          //this.socket.complete()
        }

    },
    (err) => {
      console.log(err)
    },() => {
      console.log("socket completed!")
    })
  }

  useExistingPin(){
    console.log(`pin is ${this.pinInput}`)
    let pin = this.pinInput;
    let uid;
    this.socket = this.pairing.useExistingPin(this.pinInput);
    this.socket.subscribe(
      (message) => {
        if(message.type == "ERROR"){
          this.errorMessage = message.message;
          console.log(this.errorMessage)
          this.pinInput = "";
        }
        else if(message.type=="PIN"){
          //save generated uid as pin
          let uid = message.pin;
          console.log(uid)
          sessionStorage.setItem('spotifusePin',this.pin.toString())
          sessionStorage.setItem('spotifuseUid',uid.toString())
          this.socket.next({type: "PAIR", pin: this.pinInput, sender: uid})
        }
        else if(message.type=="PAIR"){
          //send TRACKS message with getTracks() list of tracks
          this.isPaired = true;
          this.pairing.setPaired(true);
          console.log(this.auth.getTracks())
          this.socket.next({type: 'TRACKS',pin: this.pinInput, tracks: this.auth.getTracks()});
          console.log("sent tracks")
        }
        else if(message.type=="PLAYLIST"){


          console.log("we got the playlist message from server")
          this.auth.getPlaylistItems(message.playlist)
          this.auth.followPlaylist(message.playlist)
          //display playlist

          //close socket
         // this.socket.complete()
        }

    },
    (err) => {

    },() => {
      console.log("socket completed!")
    })








  }

}
