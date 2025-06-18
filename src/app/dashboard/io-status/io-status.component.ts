import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-io-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './io-status.component.html',
  styleUrl: './io-status.component.scss'
})
export class IoStatusComponent implements OnInit {

  data: any;

  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    this.wsService.initConnection('io-status');
    this.wsService.getMessages().subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);


      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

}
