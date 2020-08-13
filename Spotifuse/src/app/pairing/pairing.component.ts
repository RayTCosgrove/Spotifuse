import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss']
})
export class PairingComponent implements OnInit {

  public pin = 0;
  public newPin = false;
  public existingPin = false;

  constructor() { }

  ngOnInit(): void {
  }

}
