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

  data:any;

  constructor(private wsService: WebsocketService) { }
  ngOnInit(): void {
    this.wsService.initConnection('robo-status');
    this.wsService.getMessages().subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);
      console.log("data",this.data);

      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

  ngOnDestroy(): void {
    this.wsService.ngOnDestroy();
  }

sendCommand(address: string, value: number | boolean): void {
  const message = JSON.stringify([address, value]);

  console.log("Sending message:", message);

  this.wsService.sendMessage(message);
}
  // Helper to get status class
  getStatusClass(value: boolean): string {
    return value ? 'true' : 'false';
  }

}
