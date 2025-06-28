import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsocketService } from 'src/app/configuration/WebsocketService';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sensor-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sensor-status.component.html',
  styleUrls: ['./sensor-status.component.scss']
})
export class SensorStatusComponent  {

  data: any;
  isConnected = false;

connectionId2="plc-write";
  constructor(private wsService: WebsocketService) { }

  ngOnInit(): void {
    // this.connectToStatus();
  }

//   sendControl(tagName: string, value: boolean) {
//   this.http.post('/api/control', { tag: tagName, value: value })
//     .subscribe(
//       response => console.log('Control sent', { tag: tagName, value: value }),
//       error => console.error('Error', error)
//     );
//     console.log("{ tag: tagName, value: value }",{ tag: tagName, value: value });
// }

controlStates: { [key: string]: boolean } = {};

toggleControl(controlName: string) {
  // Toggle the state
  this.controlStates[controlName] = !this.controlStates[controlName];
  // Send the new state
  console.log(" this.controlStates[controlName] ", this.controlStates[controlName] );
  this.sendControl(controlName, this.controlStates[controlName]);
}

  async sendControl(address: string, value: any | boolean): Promise<void> {
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
    this.wsService.closeConnection(this.connectionId2);
    this.wsService.ngOnDestroy();
  }
}
