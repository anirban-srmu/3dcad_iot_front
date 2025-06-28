import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/configuration/WebsocketService';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-io-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './io-status.component.html',
  styleUrls: ['./io-status.component.scss']
})
export class IoStatusComponent implements OnInit, OnDestroy {
  data: any;
  private messageSubscription!: Subscription;
  private connectionId = 'io-status'; // Specific connection identifier

  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    // Close any existing connection first
    this.wsService.closeConnection(this.connectionId);
    
    // Initialize new connection
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

  ngOnDestroy(): void {
    this.cleanupWebSocketConnection();
  }

  private cleanupWebSocketConnection(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.wsService.closeConnection(this.connectionId);
    }

  }
}