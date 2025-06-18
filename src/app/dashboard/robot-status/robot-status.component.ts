import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

interface CardItem {
  id: number;
  title: string;
  value: boolean;
}

interface Button {
  id: number;
  title: string;
  value: boolean;
}

@Component({
  selector: 'app-robot-status',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './robot-status.component.html',
  styleUrl: './robot-status.component.scss'
})
export class RobotStatusComponent {
    // Current state from WebSocket

  data={
  "ROBOTMODE1": 0,
  "CONTROLLERSTATUS1": 0,
  "PROGRAMSTATUS1": 0,
  "ABORTPROGRAM1": 0,
  "HOMEPROGRAM1": 0,
  "MAINPROGRAM1": 1,
  "INITIALIZEPROGRAM1": 1,
  "PAUSEPROGRAM1": 1,
  "ERRORACKNOWLEDGE1": 1,
  "CONTINUEPROGRAM1": 1,
  "STARTPROGRAM1": 0,
  "LCMRMODE1": 0,
  "CONTROLLERSTATUS2": 0,
  "PROGRAMSTATUS2": 0,
  "PALLET1ACTUALPOS1": 0,
  "PALLET1ACTUALSPEED1": 0,
  "PALLET1JOGSPEED1": 0,
  "PALLET1TARGETPOS1": 0,
  "PALLET1TARGETSPEED1": 0,
  "PALLET1HOME1": 1,
  "PALLET1INITIALIZE1": 1,
  "PALLET1OPENENABLE1": 1,
  "PALLET1JOGFORWARD1": 1,
  "PALLET1JOGREVERSE1": 1,
  "PALLET1START1": 1,
  "PALLET1STOP1": 1,
  "ERRORACKNOWLEDGE2": 1,
  "LCMRMODE2": 0,
  "CONTROLLERSTATUS3": 0,
  "PROGRAMSTATUS3": 0,
  "PALLET1ACTUALPOS2": 1,
  "PALLET1ACTUALSPEED2": 0,
  "PALLET1JOGSPEED2": 0,
  "PALLET1TARGETPOS2": 1,
  "PALLET1TARGETSPEED2": 0,
  "PALLET1HOME2": 1,
  "PALLET1INITIALIZE2": 1,
  "PALLET1OPENENABLE2": 1,
  "PALLET1JOGFORWARD2": 1,
  "PALLET1JOGREVERSE2": 1,
  "PALLET1START2": 1,
  "PALLET1STOP2": 1,
  "ERRORACKNOWLEDGE3": 1
}


  constructor(private wsService: WebsocketService) { }
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

  ngOnDestroy(): void {
    this.wsService.ngOnDestroy();
  }

  sendCommand(command: string, value: number | boolean): void {
    const message = {
      command,
      value,
      timestamp: new Date().toISOString()
    };
    
  }

  // Helper to get status class
  getStatusClass(value: boolean): string {
    return value ? 'true' : 'false';
  }
  
}
