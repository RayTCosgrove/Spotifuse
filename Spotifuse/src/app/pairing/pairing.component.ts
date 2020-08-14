import { Component, OnInit } from '@angular/core';
import { PairingService } from './pairing.service'



@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss']
})
export class PairingComponent implements OnInit {

  public pin = 0;
  public newPin = false;
  public existingPin = false;

  constructor(private pairing: PairingService) { }

  ngOnInit(): void {
  }

  generateNewPin(){
    this.newPin=true;
    this.pairing.generateNewPin().subscribe((response) => {
      this.pin = response.pin;
    })
  }

}
