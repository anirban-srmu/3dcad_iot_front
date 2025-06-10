import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RecipeComponent } from './recipe/recipe.component';
import { AlarmScreenComponent } from './alarm-screen/alarm-screen.component';
import { IoStatusComponent } from './io-status/io-status.component';
import { ManualModeComponent } from './manual-mode/manual-mode.component';
import { RobotStatusComponent } from './robot-status/robot-status.component';
import { SensorStatusComponent } from './sensor-status/sensor-status.component';
import { AutoModeComponent } from './auto-mode/auto-mode.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { SessionService } from '../shared/configuration/SessionService';
import { ApiService } from '../Auth/authentication/sign-in/api.service';
import { Router } from '@angular/router';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { MachineSettingsComponent } from './machine-settings/machine-settings.component';
import { MachineOeeComponent } from './machine-oee/machine-oee.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RecipeComponent, AlarmScreenComponent, IoStatusComponent, ManualModeComponent, RobotStatusComponent, SensorStatusComponent, AutoModeComponent, HomeScreenComponent, ToastMessageComponent,MachineSettingsComponent,MachineOeeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  constructor(
    private apiService: ApiService,
    private router: Router,

  ) {

  }

  activeScreen: string = 'home';

  showScreen(screen: string): void {
    this.activeScreen = screen;
  }
  async performLogout() {
    try {
      await this.apiService.logout();
      //  this.toastr.success('Logged out successfully');
      this.router.navigate(['/auth/signin']);
    } catch (error) {
      ///  this.toastr.warning('Logged out locally (API unavailable)');
      this.router.navigate(['/auth/signin']);
    }
  }

  triggerToast(header: string, body: string, type: string): void {
    this.toastMessageComponent.showToast(header, body, type);

  }
}





