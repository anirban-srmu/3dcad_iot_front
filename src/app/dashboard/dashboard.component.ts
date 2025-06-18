import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { LocalStorageService } from '../services/services/local-storage.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RecipeComponent, AlarmScreenComponent, IoStatusComponent, ManualModeComponent, RobotStatusComponent, SensorStatusComponent, AutoModeComponent, HomeScreenComponent, ToastMessageComponent,MachineSettingsComponent,MachineOeeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(ToastMessageComponent) toastMessageComponent!: ToastMessageComponent;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private localStorageService: LocalStorageService

  ) {

  }
  data={
  "faultCodes": {
    "1": "MASTER OFF FAULT",
    "2": "EMERGENCY STOP 1 PRESSED",
    "3": "EMERGENCY STOP 2 PRESSED",
    "4": "EMERGENCY STOP 3 PRESSED",
    "5": "SAFETY DOOR 1 OPENED",
    "6": "SAFETY DOOR 2 OPENED",
    "7": "SAFETY DOOR 3 OPENED",
    "8": "SAFETY DOOR 4 OPENED",
    "9": "SAFETY DOOR 5 OPENED",
    "10": "SAFETY DOOR 6 OPENED",
    "11": "SAFETY DOOR 7 OPENED",
    "12": "SAFETY DOOR 8 OPENED",
    "13": "SAFETY DOOR 9 OPENED",
    "14": "SAFETY DOOR 10 OPENED",
    "15": "SAFETY DOOR 11 OPENED",
    "16": "SAFETY DOOR 12 OPENED",
    "17": "SAFETY DOOR 14 OPENED",
    "18": "SAFETY DOOR 15 OPENED",
    "19": "SAFETY DOOR 16 OPENED",
    "20": "AIR PRESSURE LOW",
    "21": "SPARE",
    "22": "SPARE",
    "23": "SPARE",
    "24": "SPARE",
    "25": "SPARE",
    "26": "SPARE",
    "27": "SPARE",
    "28": "SPARE",
    "29": "SPARE",
    "30": "SPARE",
    "31": "SPARE",
    "32": "SPARE",
    "33": "SPARE",
    "34": "SPARE",
    "35": "SPARE",
    "36": "SPARE",
    "37": "SPARE",
    "38": "SPARE",
    "39": "SPARE",
    "40": "SPARE",
    "41": "SPARE",
    "42": "SPARE",
    "43": "SPARE",
    "44": "SPARE",
    "45": "SPARE",
    "46": "SPARE",
    "47": "SPARE",
    "48": "SPARE",
    "49": "SPARE",
    "50": "SPARE",
    "51": "SPARE",
    "52": "SPARE",
    "53": "SPARE",
    "54": "SPARE",
    "55": "SPARE",
    "56": "SPARE",
    "57": "SPARE",
    "58": "SPARE",
    "59": "SPARE",
    "60": "SPARE",
    "61": "SPARE",
    "62": "SPARE",
    "63": "SPARE",
    "64": "SPARE",
    "65": "SPARE",
    "66": "SPARE",
    "67": "SPARE",
    "68": "SPARE",
    "69": "SPARE",
    "70": "SPARE",
    "71": "SPARE",
    "72": "SPARE",
    "73": "SPARE",
    "74": "SPARE",
    "75": "SPARE",
    "76": "SPARE",
    "77": "SPARE",
    "78": "SPARE",
    "79": "SPARE",
    "80": "SPARE",
    "81": "SPARE",
    "82": "SPARE",
    "83": "SPARE",
    "84": "SPARE",
    "85": "SPARE",
    "86": "SPARE",
    "87": "SPARE",
    "88": "SPARE",
    "89": "SPARE",
    "90": "SPARE",
    "91": "SPARE",
    "92": "SPARE",
    "93": "SPARE",
    "94": "SPARE",
    "95": "SPARE",
    "96": "SPARE",
    "97": "SPARE",
    "98": "SPARE",
    "99": "SPARE",
    "100": "LOADING CONVEYOR SERVO COMMUNICATION FAULT",
    "101": "LOADING CONVEYOR SERVO FAULT",
    "102": "LOADING CONVEYOR SERVO FAULT",
    "103": "LOADING CONVEYOR PART REACHED AT CONVEYOR END POSITION",
    "104": "SCARA ROBOT COMMUNICATION FAULT",
    "105": "SCARA ROBOT TEACH PENDANT IS ENABLED",
    "106": "SCARA ROBOT PROGRAM RUN TIMEOUT",
    "107": "SCARA ROBOT IS IN FAULT MODE",
    "108": "SCARA ROBOT KEY IS NOT IN AUTO",
    "109": "SCARA ROBOT EMERGENCY PRESSED",
    "110": "SCARA ROBOT IS NOT AT HOME POSTION",
    "111": "SCARA ROBOT CAMERA FAULT",
    "112": "SCARA ROBOT AT UNKNOWN POSITION",
    "113": "BARCODE SCANNER 1 COMMUNICATION FAULT",
    "114": "BARCODE SCANNER 1 NOT READY",
    "115": "BARCODE SCANNER 2 COMMUNICATION FAULT",
    "116": "BARCODE SCANNER 2 NOT READ",
    "117": "GANTRY 1 Y AXIS 1 SINGLE AXIS ROBOT COMMUNICATION FAULT",
    "118": "GANTRY 1 Y AXIS 1 SINGLE AXIS ROBOT FAULT",
    "119": "GANTRY 1 Y AXIS 2 FESTO SERVO COMMUNICATION FAULT",
    "120": "GANTRY 1 Y AXIS 2 FESTO SERVO FAULT",
    "121": "VISION STAGE 1 COMMUNICATION FAULT",
    "122": "VISION STAGE 1 NOT READY",
    "123": "VISION STAGE 1 ALARM",
    "124": "VISION STAGE 1 OVERALL RESULT NG",
    "125": "VISION STAGE 1 OVERALL RESULT NOT READ",
    "126": "VISION STAGE 1 CAMERA 1 RESULT NG",
    "127": "VISION STAGE 1 CAMERA 1 RESULT NOT READ",
    "128": "VISION STAGE 1 CAMERA 2 RESULT NG",
    "129": "VISION STAGE 1 CAMERA 2 RESULT NOT READ",
    "130": "VISION STAGE 1 CAMERA 3 RESULT NG",
    "131": "VISION STAGE 1 CAMERA 3 RESULT NOT READ",
    "132": "VISION STAGE 1 CAMERA 3 RESULT NG",
    "133": "VISION STAGE 1 CAMERA 3 RESULT NOT READ",
    "134": "VISION STAGE 1 CAMERA 4 RESULT NG",
    "135": "VISION STAGE 1 CAMERA 4 RESULT NOT READ",
    "136": "VISION STAGE 1 CAMERA 5 RESULT NG",
    "137": "VISION STAGE 1 CAMERA 5 RESULT NOT READ",
    "138": "LCMR COMMUNICATION FAULT",
    "139": "LCMR IS IN FAULT MODE",
    "140": "LCMR AT UNKNOWN POSITION",
    "141": "LCMR",
    "142": "LCMR",
    "143": "LCMR",
    "144": "LCMR",
    "145": "LCMR",
    "146": "LCMR",
    "147": "LCMR",
    "148": "LCMR",
    "149": "LCMR",
    "150": "VISION STAGE 2 COMMUNICATION FAULT",
    "151": "VISION STAGE 2 NOT READY",
    "152": "VISION STAGE 2 ALARM",
    "153": "VISION STAGE 2 OVERALL RESULT NG",
    "154": "VISION STAGE 2 OVERALL RESULT NOT READ",
    "155": "VISION STAGE 2 CAMERA 1 RESULT NG",
    "156": "VISION STAGE 2 CAMERA 1 RESULT NOT READ",
    "157": "VISION STAGE 2 CAMERA 2 RESULT NG",
    "158": "VISION STAGE 2 CAMERA 2 RESULT NOT READ",
    "159": "VISION STAGE 2 CAMERA 3 RESULT NG",
    "160": "VISION STAGE 2 CAMERA 3 RESULT NOT READ",
    "161": "VISION STAGE 2 CAMERA 3 RESULT NG",
    "162": "VISION STAGE 2 CAMERA 3 RESULT NOT READ",
    "163": "VISION STAGE 2 CAMERA 4 RESULT NG",
    "164": "VISION STAGE 2 CAMERA 4 RESULT NOT READ",
    "165": "VISION STAGE 2 CAMERA 5 RESULT NG",
    "166": "VISION STAGE 2 CAMERA 5 RESULT NOT READ",
    "167": "UNLOADING CONVEYOR SERVO COMMUNICATION FAULT",
    "168": "UNLOADING CONVEYOR SERVO FAULT",
    "169": "UNLOADING CONVEYOR PART REACHED AT CONVEYOR END POSITION",
    "200": "GANTRY 1 ROTARY CYL 1 ADVANCE REEDSWITCH TIME OUT FAULT",
    "201": "GANTRY 1 ROTARY CYL 1 RETRACT REEDSWITCH TIME OUT FAULT",
    "202": "GANTRY 1 ROTARY CYL 1 BOTH REEDSWITCH ON FAULT",
    "203": "GANTRY 1 ROTARY CYL 1 BOTH SOLENOID ON FAULT",
    "204": "GANTRY 1 ROTARY CYL 2 ADVANCE REEDSWITCH TIME OUT FAULT",
    "205": "GANTRY 1 ROTARY CYL 2 RETRACT REEDSWITCH TIME OUT FAULT",
    "206": "GANTRY 1 ROTARY CYL 2 BOTH REEDSWITCH ON FAULT",
    "207": "GANTRY 1 ROTARY CYL 2 BOTH SOLENOID ON FAULT",
    "208": "GANTRY 2 ROTARY CYL 1 ADVANCE REEDSWITCH TIME OUT FAULT",
    "209": "GANTRY 2 ROTARY CYL 1 RETRACT REEDSWITCH TIME OUT FAULT",
    "210": "GANTRY 2 ROTARY CYL 1 BOTH REEDSWITCH ON FAULT",
    "211": "GANTRY 2 ROTARY CYL 1 BOTH SOLENOID ON FAULT",
    "212": "GANTRY 2 ROTARY CYL 2 ADVANCE REEDSWITCH TIME OUT FAULT",
    "213": "GANTRY 2 ROTARY CYL 2 RETRACT REEDSWITCH TIME OUT FAULT",
    "214": "GANTRY 2 ROTARY CYL 2 BOTH REEDSWITCH ON FAULT",
    "215": "GANTRY 2 ROTARY CYL 2 BOTH SOLENOID ON FAULT",
    "216": "GANTRY 2 UP/DWN CYL 1 DWN REEDSWITCH TIME OUT FAULT",
    "217": "GANTRY 2 UP/DWN CYL 1 UP REEDSWITCH TIME OUT FAULT",
    "218": "GANTRY 2 UP/DWN CYL 1 BOTH REEDSWITCH ON FAULT",
    "219": "GANTRY 2 UP/DWN CYL 1 BOTH SOLENOID ON FAULT",
    "220": "GANTRY 2 UP/DWN CYL 2 DWN REEDSWITCH TIME OUT FAULT",
    "221": "GANTRY 2 UP/DWN CYL 2 UP REEDSWITCH TIME OUT FAULT",
    "222": "GANTRY 2 UP/DWN CYL 2 BOTH REEDSWITCH ON FAULT",
    "223": "GANTRY 2 UP/DWN CYL 2 BOTH SOLENOID ON FAULT",
    "224": "ROBOT UP/DWN CYL 1 DWN REEDSWITCH TIME OUT FAULT",
    "225": "ROBOT UP/DWN CYL 1 UP REEDSWITCH TIME OUT FAULT",
    "226": "ROBOT UP/DWN CYL 1 BOTH REEDSWITCH ON FAULT",
    "227": "ROBOT UP/DWN CYL 1 BOTH SOLENOID ON FAULT",
    "228": "ROBOT UP/DWN CYL 2 DWN REEDSWITCH TIME OUT FAULT",
    "229": "ROBOT UP/DWN CYL 2 UP REEDSWITCH TIME OUT FAULT",
    "230": "ROBOT UP/DWN CYL 2 BOTH REEDSWITCH ON FAULT",
    "231": "ROBOT UP/DWN CYL 2 BOTH SOLENOID ON FAULT",
    "250": ""
  }
}
  ngOnInit(): void {
    this.localStorageService.setItem("data",this.data);
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





