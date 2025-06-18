import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-start-up',
  standalone: true,
  imports: [],
  templateUrl: './start-up.component.html',
  styleUrl: './start-up.component.scss'
})
export class StartUpComponent implements OnInit {

  constructor(private wsService: WebsocketService) { }

  data: any = [];
  ngOnInit(): void {
    this.wsService.initConnection('startup-status');
    this.wsService.getMessages().subscribe((msg: string) => {
      try {
        const data = JSON.parse(msg);
        this.data = data;
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

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
}
