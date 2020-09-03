import { Component, OnInit } from '@angular/core';
import { PairingService } from './pairing.service'
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';




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
  public paired = false;
  private socket;

  constructor(private pairing: PairingService, private auth: SpotifyAuthService) { }

  ngOnInit(): void {
  }

  generateNewPin(){
    this.newPin=true;
    this.socket = this.pairing.generateNewPin();
    this.socket.subscribe(
      (message) => {
        if(message.type=="UID"){
          //save generated uid as pin
          this.pin = message.pin;
          sessionStorage.setItem('spotifusePin',this.pin.toString())
        }
        else if(message.type=="PAIR"){
          //send TRACKS message with getTracks() list of tracks
          this.paired = true;
          console.log("sending back tracks bc paired")
          this.socket.next({'type': 'TRACKS','pin': this.pin, 'tracks': this.auth.getTracks()});
        }
        else if(message.type=="TRACKS"){
          //merge track lists

          //get recs from spotify api

          //create collav playlist with spotify api

          //add songs with spotify api

          //send playlist id to server

          //display playlist

          //close socket
          this.socket.complete()
        }

    },
    (err) => {
      console.log(err)
    },() => {
      console.log("socket completed!")
    })
  }

  useExistingPin(){

    this.socket = this.pairing.useExistingPin(this.pinInput);
    this.socket.subscribe(
      (message) => {
        if(message.type=="UID"){
          //save generated uid as pin
          this.pin = message.pin;
          sessionStorage.setItem('spotifusePin',this.pin.toString())
        }
        else if(message.type=="PAIR"){
          //send TRACKS message with getTracks() list of tracks
          this.paired = true;
          console.log("sending back tracks bc paired")
          this.socket.next({'type': 'TRACKS','pin': this.pin, 'tracks': this.auth.getTracks()});
        }
        else if(message.type=="TRACKS"){
          //merge track lists

          //get recs from spotify api

          //create collav playlist with spotify api

          //add songs with spotify api

          //send playlist id to server

          //display playlist

          //close socket
          this.socket.complete()
        }

    },
    (err) => {
      console.log(err)
    },() => {
      console.log("socket completed!")
    })






    console.log(`pin is ${this.pinInput}`)
    let pin = this.pinInput;

  }

}
