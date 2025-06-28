import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-manual-mode',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './manual-mode.component.html',
  styleUrl: './manual-mode.component.scss'
})
export class ManualModeComponent  implements OnInit, OnDestroy{

  connectionId="manual-status";
    connectionId2="plc-write";
  isConnected: boolean= false;

constructor(private wsService:WebsocketService){}


  ngOnInit(): void {
    this.wsService.initConnection(this.connectionId);
    this.wsService.getMessages(this.connectionId).subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

  value:boolean=false
  toggleValue(address: string){
        this.value = !this.value;
 this.pushValue(address, this.value);
    console.log("value:", address,this.value);
  }

  data:any;
    async pushValue(address: string, value: any): Promise<void> {

      const data = {
      section: 'manual',
      tag_name: address,
      value: value
    };
    const message = JSON.stringify(data);

    console.log("Sending message:", message);

    try {
      if (!this.isConnected) {
        this.wsService.initConnection(this.connectionId2);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      this.wsService.sendMessage(this.connectionId2,message).subscribe({
        next: (response: any) => {
          console.log("WebSocket Response:", response);
        },
        error: (error: any) => {
          console.error("WebSocket Error:", error);

        }
      });
    } catch (error) {
      console.error("Command failed:", error);
    }
  }

  jogspeed:number =0;
  targetspeed:number =0;

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

setJogValues(register: string,value:any) {
if(this.jogspeed !== 0){
 this.pushValue('JOG_SPEED', this.jogspeed);
  console.log("JOG_SPEED",this.jogspeed)
}
if(this.targetspeed !==0){
this.pushValue('TARGET_SPEED', this.targetspeed);
 console.log("TARGET_SPEED",this.targetspeed)
}
 this.pushValue(register, value);
  console.log("register, value",register, value)

}

  ngOnDestroy(): void {
    this.wsService.closeConnection(this.connectionId);
     this.wsService.closeConnection(this.connectionId2);
    this.wsService.ngOnDestroy();
  }

}
