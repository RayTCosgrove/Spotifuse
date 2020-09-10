import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';
import { Pin } from './pin'
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from './Message';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PairingService {

  private socket$: WebSocketSubject<Message>;
  private paired = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private auth: SpotifyAuthService) { }


  generateNewPin(){

    this.socket$ = new WebSocketSubject('wss://spotifuse.herokuapp.com/');

    return this.socket$;


  }

  setPaired(isPaired: boolean){
    this.paired.next(isPaired);
  }

  isPaired(){
    return this.paired;
  }

  useExistingPin(pin: number){

    this.socket$ = new WebSocketSubject('wss://spotifuse.herokuapp.com/?pin='+pin);

    return this.socket$;


  }




}
