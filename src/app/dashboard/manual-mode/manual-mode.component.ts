import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-manual-mode',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manual-mode.component.html',
  styleUrl: './manual-mode.component.scss'
})
export class ManualModeComponent {

constructor(private wsService:WebsocketService){}


  ngOnInit(): void {
    this.wsService.initConnection('robo-status');
    this.wsService.getMessages().subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

  data:any;
    pushValue(address: string, value: number): void {
    if (typeof value !== 'number' || (value !== 0 && value !== 1)) {
      console.error('Invalid value - must be 0 or 1');
      return;
    }
    const update = {
      [address]: value
    };

    this.wsService.sendMessage(JSON.stringify(update));

    console.log(`Sent update: ${address} = ${value}`);
  }


targetPoslc: number = 0;
targetSpeedlc: number = 0;
targetPosg2f: number = 0;
targetSpeedg2f: number = 0;
targetPosg1f: number = 0;
targetSpeedg1f: number = 0;
targetPosg2x: number = 0;
targetSpeedg2x: number = 0;
targetPosuc: number = 0;
targetSpeeduc: number = 0;
targetPosg2y: number = 0;
targetSpeedg2y: number = 0;
targetPosg1y: number = 0;
targetSpeedg1y: number = 0;

setJogValues(register: string, address1:any, pos: number,  address2:any, speed: number) {
  this.pushValue(address1, pos);
  this.pushValue(address2, speed);
  this.pushValue(register, 1);
  console.log("passing value to plc",address1, pos,address2, speed,register, 1)
}

}
