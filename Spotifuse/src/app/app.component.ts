import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SpotifyAuthService } from './spotify-auth/spotify-auth.service';
import { PairingService } from './pairing/pairing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Spotifuse';
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isAuthed: boolean;
  isPaired: boolean;

  constructor(private _formBuilder: FormBuilder, private auth: SpotifyAuthService, private pairing: PairingService) {}

  ngOnInit() {

    this.auth.isAuthed().subscribe(authed => {
      this.isAuthed = authed;
    })

    this.pairing.isPaired().subscribe(paired => {
      this.isPaired = paired;
    })


    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}

