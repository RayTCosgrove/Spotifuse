import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import {AuthObject} from './AuthObject'
import {Track} from './Track'
import { WebSocketSubject } from 'rxjs/webSocket';
import {Message} from '../pairing/Message'

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  private accessToken: string;
  private authed = new BehaviorSubject<boolean>(false);
  private tracks;
  private userId;
  private playlistId;
  private playlistItems = new BehaviorSubject<Track[]>(null);
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  public getAccessToken() {
    const my_client_id = '773438fd2f64447995227e8cf9a7c1a5';
    const redirect_uri = 'https://spotifuse.herokuapp.com/';

    var scopes = 'user-read-private user-read-email user-top-read playlist-modify-public playlist-modify-private';
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
      .get<AuthObject>('https://api.spotify.com/v1/me/top/tracks', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + accessToken }),
      })
      .subscribe((response) => {
        this.tracks = response.items;
        console.log(this.tracks)
      });

      this.http
      .get<AuthObject>('https://api.spotify.com/v1/me/', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + accessToken }),
      })
      .subscribe((response) => {
        this.userId = response.id;
        console.log(this.userId)
      });


    this.authed.next(true);
  }

  public getTracks(){
    return this.tracks;
  }

  public isAuthed() {
    return this.authed;
  }

  public createPlaylist(tracks: string[], socket: WebSocketSubject<Message>, pin: number){
    this.http.post<AuthObject>('https://api.spotify.com/v1/users/' + this.userId + '/playlists',{'name':'Spotifused Playlist', 'public': true, 'collaborative': true} ,{
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.accessToken }).set('Content-Type', 'application/json'),
    }).subscribe((response) =>
    {
      console.log(response)
      this.playlistId = response.id

      this.http.post('https://api.spotify.com/v1/playlists/'+this.playlistId+'/tracks',{'uris': tracks},{
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.accessToken }).set('Content-Type', 'application/json'),
      }).subscribe((snapshotId) => {
        console.log(snapshotId)
        this.getPlaylistItems(this.playlistId)
        socket.next({type: 'PLAYLIST', playlist: this.playlistId, pin})
      })

    })
  }

  public getPlaylistItems(playlist_id: string){
    if(playlist_id==null){
      playlist_id = this.playlistId;
    }
    console.log("------------------we boutta request them")
    this.http.get<AuthObject>( 'https://api.spotify.com/v1/playlists/' +playlist_id+ '/tracks',{
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.accessToken }),
    }).subscribe((playlist) => {
      console.log("------------------we got them")
      let items = playlist.items;
      let tracks = []
      for(let i = 0; i < items.length; i++){
        if(i==0){
        console.log(items[i])
        }
        tracks.push({name: items[i].track.name, artist: items[i].track.artists[0].name, url: items[i].track.external_urls.spotify})
      }
      this.playlistItems.next(tracks)
    })
    return this.playlistItems;
  }


public followPlaylist(playlist_id: string){


  this.http.put('https://api.spotify.com/v1/playlists/'+this.playlistId+'/followers',{
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.accessToken }).set('Content-Type', 'application/json'),
  }).subscribe((snapshotId) => {
    console.log('playlist followed')

  })

}
}
