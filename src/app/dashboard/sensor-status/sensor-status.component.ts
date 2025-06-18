import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-sensor-status',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sensor-status.component.html',
  styleUrl: './sensor-status.component.scss'
})
export class SensorStatusComponent {

  
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
