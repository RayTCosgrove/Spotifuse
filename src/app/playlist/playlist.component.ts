import { Component, OnInit } from '@angular/core';
import { SpotifyAuthComponent } from '../spotify-auth/spotify-auth.component';
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  public tracks;
  constructor(private auth: SpotifyAuthService) {
    console.log("requestion playlist items")
    this.auth.getPlaylistItems(null).subscribe((items) =>{
      console.log("got a tracks update")
      console.log(items)
      this.tracks = items;
    })
   }

  ngOnInit(): void {

  }

  newTab(href: string){
    window.open(href, "_blank");
  }

}
