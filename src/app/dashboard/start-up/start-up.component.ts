import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/configuration/WebsocketService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-up',
  standalone: true,
  imports: [],
  templateUrl: './start-up.component.html',
  styleUrls: ['./start-up.component.scss']
})
export class StartUpComponent implements OnInit, OnDestroy {
  private messageSubscription: Subscription | null = null;
  data: any;
  connectionId = 'startup-status';
  constructor(private wsService: WebsocketService) { }
isConnected = false;
  ngOnInit(): void {

    this.wsService.initConnection(this.connectionId);
    this.messageSubscription = this.wsService.getMessages(this.connectionId).subscribe({
      next: (msg: string) => {
        try {
          this.data = msg; 
        } catch (e) {
          console.error('Error processing message:', e);
        }
      },
      error: (err) => {
        console.error('WebSocket error:', err);
      },
      complete: () => {
        console.log('WebSocket connection closed');
      }
    });
  }
  async pushValue(address: string, value: number): Promise<void> {
    if (typeof value !== 'number' || (value !== 0 && value !== 1)) {
      console.error('Invalid value - must be 0 or 1');
      return;
    }

    const data = {
      section: 'startup',
      tag_name: address,
      value: value
    };
    const message = JSON.stringify(data);

    console.log("Sending message:", message);

    try {
      if (!this.isConnected) {
        this.wsService.initConnection('plc-write');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      this.wsService.sendMessage(this.connectionId,message).subscribe({
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

  ngOnDestroy(): void {
    
    if (this.messageSubscription) {
      this.wsService.closeConnection(this.connectionId);
      this.messageSubscription.unsubscribe();
    }
  }
}