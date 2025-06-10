import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

interface IOItem {
  name: string;
  address: string;
  value: boolean;
}

@Component({
  selector: 'app-io-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './io-status.component.html',
  styleUrl: './io-status.component.scss'
})
export class IoStatusComponent implements OnInit {

  ioItems: IOItem[] = [
    // Main Control Unit
    { name: 'START PB - MAIN CONTROL UNIT', address: 'M1000', value: false },
    { name: 'STOP PB - MAIN CONTROL UNIT', address: 'M1001', value: false },
    { name: 'HOLD PB - MAIN CONTROL UNIT', address: 'M1002', value: false },
    { name: 'RESTART PB - MAIN CONTROL UNIT', address: 'M1003', value: false },
    { name: 'EMERGENCY PB - MAIN CONTROL UNIT', address: 'M1004', value: false },
  
    // Conveyor Systems
    { name: 'START PB - INPUT CONVEYOR', address: 'M1005', value: false },
    { name: 'EMERGENCY PB - INPUT CONVEYOR', address: 'M1006', value: false },
    { name: 'EMERGENCY PB - OUTPUT CONVEYOR', address: 'M1096', value: false },
    { name: 'AIR PRESSURE SWITCH', address: 'M1007', value: false },
    { name: 'UNLOADING AREA SENSOR - OUTPUT CONVEYOR', address: 'M1097', value: false },
    { name: 'GANTRY LOADING AREA SENSOR - OUTPUT CONVEYOR', address: 'M1098', value: false },
    { name: 'PART PRESENT AT ROBO PICK - INPUT CONVEYOR', address: 'M1022', value: false },
    { name: 'PART PRESENT AT CONVEYOR END - INPUT CONVEYOR', address: 'M1023', value: false },
  
    // Robot Systems
    { name: 'PART PRESENT AT ROBOT GRIPPER -1 (VACUUM FEEDBACK)', address: 'M1016', value: false },
    { name: 'PART PRESENT AT ROBOT GRIPPER -2 (VACUUM FEEDBACK)', address: 'M1017', value: false },
    { name: 'ROBOT GRIPPER - 1 UP/DWN CYL UP SIDE REEDSWITCH', address: 'M1018', value: false },
    { name: 'ROBOT GRIPPER - 1 UP/DWN CYL DWN SIDE REEDSWITCH', address: 'M1019', value: false },
    { name: 'ROBOT GRIPPER - 2 UP/DWN CYL UP SIDE REEDSWITCH', address: 'M1020', value: false },
    { name: 'ROBOT GRIPPER - 2 UP/DWN CYL DWN SIDE REEDSWITCH', address: 'M1021', value: false },
  
    // Fixture Systems
    { name: 'FIXTURE 1 (VACUUM FEEDBACK) 1', address: 'M1032', value: false },
    { name: 'FIXTURE 1 (VACUUM FEEDBACK) 2', address: 'M1033', value: false },
    { name: 'FIXTURE 1 PART PRESENT -1', address: 'M1034', value: false },
    { name: 'FIXTURE 1 PART PRESENT -2', address: 'M1035', value: false },
    { name: 'FIXTURE 1 PART PRESENT -3', address: 'M1036', value: false },
    { name: 'FIXTURE 1 PART PRESENT -4', address: 'M1037', value: false },
    { name: 'FIXTURE 2 (VACUUM FEEDBACK) 1', address: 'M1038', value: false },
    { name: 'FIXTURE 2 (VACUUM FEEDBACK) 2', address: 'M1039', value: false },
    { name: 'FIXTURE 2 PART PRESENT -1', address: 'M1040', value: false },
    { name: 'FIXTURE 2 PART PRESENT -2', address: 'M1041', value: false },
    { name: 'FIXTURE 2 PART PRESENT -3', address: 'M1042', value: false },
    { name: 'FIXTURE 2 PART PRESENT -4', address: 'M1043', value: false },
  
    // Gantry Systems
    { name: 'GANTRY 1 VACUUM FEED BACK 1', address: 'M1048', value: false },
    { name: 'GANTRY 1 VACUUM FEED BACK 2', address: 'M1049', value: false },
    { name: 'GANTRY 1 PART PRESENT 1', address: 'M1050', value: false },
    { name: 'GANTRY 1 PART PRESENT 2', address: 'M1051', value: false },
    { name: 'GANTRY 1 ROTARY CYL 1 ADVANCE REEDSWITCH', address: 'M1052', value: false },
    { name: 'GANTRY 1 ROTARY CYL 1 RETRACT REEDSWITCH', address: 'M1053', value: false },
    { name: 'GANTRY 1 ROTARY CYL 2 ADVANCE REEDSWITCH', address: 'M1054', value: false },
    { name: 'GANTRY 1 ROTARY CYL 2 RETRACT REEDSWITCH', address: 'M1055', value: false },
    { name: 'GANTRY 1 TOYO FWD LIMIT SWITCH', address: 'M1056', value: false },
    { name: 'GANTRY 1 TOYO REV LIMIT SWITCH', address: 'M1057', value: false },
    { name: 'GANTRY 2 VACUUM FEED BACK 1', address: 'M1064', value: false },
    { name: 'GANTRY 2 VACUUM FEED BACK 2', address: 'M1065', value: false },
    { name: 'GANTRY 2 PART PRESENT 1', address: 'M1066', value: false },
    { name: 'GANTRY 2 PART PRESENT 2', address: 'M1067', value: false },
    { name: 'GANTRY 2 ROTARY CYL 1 ADVANCE REEDSWITCH', address: 'M1068', value: false },
    { name: 'GANTRY 2 ROTARY CYL 1 RETRACT REEDSWITCH', address: 'M1069', value: false },
    { name: 'GANTRY 2 ROTARY CYL 2 ADVANCE REEDSWITCH', address: 'M1070', value: false },
    { name: 'GANTRY 2 ROTARY CYL 2 RETRACT REEDSWITCH', address: 'M1071', value: false },
    { name: 'GANTRY 2 TOYO FWD LIMIT SWITCH', address: 'M1072', value: false },
    { name: 'GANTRY 2 TOYO REV LIMIT SWITCH', address: 'M1073', value: false },
    { name: 'SAFETY DOOR -1', address: 'M1080', value: false },
    { name: 'SAFETY DOOR -2', address: 'M1081', value: false },
    { name: 'SAFETY DOOR -3', address: 'M1082', value: false },
    { name: 'SAFETY DOOR -4', address: 'M1083', value: false },
    { name: 'SAFETY DOOR -5', address: 'M1084', value: false },
    { name: 'SAFETY DOOR -6', address: 'M1085', value: false },
    { name: 'SAFETY DOOR -7', address: 'M1086', value: false },
    { name: 'SAFETY DOOR -8', address: 'M1087', value: false },
    { name: 'SAFETY DOOR -9', address: 'M1088', value: false },
    { name: 'SAFETY DOOR -10', address: 'M1089', value: false },
    { name: 'SAFETY DOOR -11', address: 'M1090', value: false },
    { name: 'SAFETY DOOR -12', address: 'M1091', value: false },
    { name: 'SAFETY DOOR -13', address: 'M1092', value: false },
    { name: 'SAFETY DOOR -14', address: 'M1093', value: false },
    { name: 'SAFETY DOOR -15', address: 'M1094', value: false },
    { name: 'SAFETY DOOR -16', address: 'M1095', value: false }
  ];

  constructor(private wsService: WebsocketService) {}

  ngOnInit(): void {
    this.wsService.initConnection('io-status');
    this.wsService.getMessages().subscribe((msg: string) => {
      try {
        const data = JSON.parse(msg);
        
        // 3. Update each IO item
        this.ioItems.forEach(item => {
          if (data[item.address] !== undefined) {
            item.value = data[item.address] === 1; // Convert 0/1 to false/true
          }
        });
        
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });
  }

}
