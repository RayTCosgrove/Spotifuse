import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SpotifyAuthService} from './spotify-auth.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-spotify-auth',
  templateUrl: './spotify-auth.component.html',
  styleUrls: ['./spotify-auth.component.scss']
})
export class SpotifyAuthComponent implements OnInit {


  public isAuthed = false;
  constructor(private http: HttpClient, private auth: SpotifyAuthService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string) => {
      let accessToken = new URLSearchParams(fragment).get('access_token');

      if(accessToken!==null){
        this.auth.setAccessToken(accessToken)
        this.isAuthed = true;
      }


    });
  }

  login(): void{
    this.auth.getAccessToken()

  }

}
