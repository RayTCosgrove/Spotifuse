import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';
import { Pin } from './pin'
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from './Message';


@Injectable({
  providedIn: 'root'
})
export class PairingService {

  private socket$: WebSocketSubject<Message>;


  constructor(private http: HttpClient, private auth: SpotifyAuthService) { }


  generateNewPin(){

    this.socket$ = new WebSocketSubject('ws://localhost:3000');

    return this.socket$;


  }

  pairWithExistingPin(pin: number){

    return this.http.post('http://localhost:3000/existingPin',{pin},{})

  }



}
