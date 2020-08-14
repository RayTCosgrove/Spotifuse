import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';
import { Pin } from './pin'
@Injectable({
  providedIn: 'root'
})
export class PairingService {

  constructor(private http: HttpClient, private auth: SpotifyAuthService) { }


  generateNewPin(){
    return this.http.post<Pin>('http://localhost:3000/newPin',this.auth.getTracks(),{});
  }

  pairWithExistingPin(){

  }



}
