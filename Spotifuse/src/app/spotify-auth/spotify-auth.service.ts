import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  private accessToken: string;
  private authed = new BehaviorSubject<boolean>(false);
  private tracks;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  public getAccessToken() {
    const my_client_id = '773438fd2f64447995227e8cf9a7c1a5';
    const redirect_uri = 'http://localhost:4200';

    var scopes = 'user-read-private user-read-email user-top-read';
    var state = 'authing';

    window.location.href =
      'https://accounts.spotify.com/authorize?' +
      '&client_id=' +
      my_client_id +
      '&redirect_uri=' +
      encodeURIComponent(redirect_uri) +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&response_type=token&state=' +
      state;
  }

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;

    this.http
      .get('https://api.spotify.com/v1/me/top/tracks', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + accessToken }),
      })
      .subscribe((response) => {
        this.tracks = response;
        console.log(this.tracks)
      });

    this.authed.next(true);
  }

  public getTracks(){
    return this.tracks;
  }

  public isAuthed() {
    return this.authed;
  }
}
