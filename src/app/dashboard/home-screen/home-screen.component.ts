import { Component } from '@angular/core';
import { AutoModeComponent } from '../auto-mode/auto-mode.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StartUpComponent } from '../start-up/start-up.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [AutoModeComponent,FormsModule,CommonModule,StartUpComponent],
  templateUrl: './home-screen.component.html',
  styleUrl: './home-screen.component.scss'
})
export class HomeScreenComponent {

  showAutoMode: boolean = false;
  showstartMode: boolean = false;
  showhome : boolean = true;
  toggleAutoMode(value:any) {
    if(value == "startup"){
      this.showAutoMode = false;
      this.showhome = false;
      this.showstartMode=true
    } else if(value == "automode"){
      this.showAutoMode = true;
      this.showhome = false;
      this.showstartMode=false;
    }

  }
  goBackHome() {
    this.showAutoMode = false;
    this.showhome = true;
    this.showstartMode=false;
  }
}
