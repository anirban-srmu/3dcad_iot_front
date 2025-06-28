import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-robot-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './robot-status.component.html',
  styleUrl: './robot-status.component.scss'
})
export class RobotStatusComponent implements OnInit, OnDestroy {
  data: any;
  isConnected = false;
connectionId="robo-status";
connectionId2="plc-write";
  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.connectToStatus();
  }

  private connectToStatus(): void {
    this.wsService.initConnection(this.connectionId);
    this.wsService.getMessages(this.connectionId).subscribe({
      next: (msg: string) => {
        try {
          this.data = JSON.parse(msg);
          console.log("data", this.data);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      },
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed')
    });
  }

  async sendCommand(address: string, value: number | boolean): Promise<void> {
    const data = {
      section: 'robo',
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

  getStatusClass(value: boolean): string {
    return value ? 'true' : 'false';
  }

  ngOnDestroy(): void {
    this.wsService.closeConnection(this.connectionId);
    this.wsService.ngOnDestroy();
  }
}
