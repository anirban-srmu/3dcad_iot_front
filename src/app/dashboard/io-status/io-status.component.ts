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
  styleUrl: './io-status.component.scss'
})
export class IoStatusComponent implements OnInit, OnDestroy {

  data: any;
  private messageSubscription!: Subscription;

  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.wsService.initConnection('io-status');
    this.messageSubscription = this.wsService.getMessages().subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.wsService.ngOnDestroy(); // <-- Make sure your service has a close/disconnect method
  }

}
