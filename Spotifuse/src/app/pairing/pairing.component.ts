import { Component, OnInit } from '@angular/core';
import { PairingService } from './pairing.service'




@Component({
  selector: 'app-pairing',
  templateUrl: './pairing.component.html',
  styleUrls: ['./pairing.component.scss']
})
export class PairingComponent implements OnInit {

  public pin = 0;
  public pinInput;
  public newPin = false;
  public existingPin = false;
  public paired = false;

  constructor(private pairing: PairingService) { }

  ngOnInit(): void {
  }

  generateNewPin(){
    this.newPin=true;

    this.pairing.generateNewPin().subscribe(
      (message) => {
        console.log(message)
      if(this.pin===0){
        this.pin = message.pin;
        sessionStorage.setItem('spotifusePin',this.pin.toString())
      }else{
        if(message.paired){

          this.paired = message.paired;

        }
      }
    },
    (err) => {
      console.log(err)
    },() => {
      console.log("socket completed!")
    })
  }

  useExistingPin(){
    console.log(`pin is ${this.pinInput}`)
    this.pairing.pairWithExistingPin(this.pinInput).subscribe(
      (response) => {
        console.log(response)
      }

    )
  }

}
