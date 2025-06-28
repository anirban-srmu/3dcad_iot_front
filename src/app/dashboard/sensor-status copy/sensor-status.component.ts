import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sensor-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-status.component.html',
  styleUrls: ['./sensor-status.component.scss']
})
export class SensorStatusComponent implements OnInit, OnDestroy {
  data: any;
  private messageSubscription: Subscription | undefined;
  connectionId = 'sensor-status';
  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }

  ngOnDestroy(): void {
    this.cleanupWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    this.wsService.initConnection(this.connectionId);
    this.messageSubscription = this.wsService.getMessages(this.connectionId).subscribe({
      next: (msg: string) => this.handleIncomingMessage(msg),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  private handleIncomingMessage(msg: string): void {
    try {
      this.data = JSON.parse(msg);
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  }

  private cleanupWebSocketConnection(): void {
    if (this.messageSubscription) {
      this.wsService.closeConnection(this.connectionId);
      this.messageSubscription.unsubscribe();
    }
  }
}