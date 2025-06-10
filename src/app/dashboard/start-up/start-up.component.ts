import { Component } from '@angular/core';


// interface DeviceStatus {
//   name: string;
//   status: boolean;
//   modeActive: boolean;
//   controllerActive: boolean;
//   programActive: boolean;
//   positionActive: boolean;
//   speedActive: boolean;
//   jogActive: boolean;
//   actualPos: string;
//   actualSpeed: string;
//   jogSpeed: string;
// }


@Component({
  selector: 'app-start-up',
  standalone: true,
  imports: [],
  templateUrl: './start-up.component.html',
  styleUrl: './start-up.component.scss'
})
export class StartUpComponent {
  devices = {
    loadingConveyor: {
      name: 'LOADING CONVEYOR',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: '1250 mm',
      actualSpeed: '50%',
      jogSpeed: '10%'
    },
    unloadConveyor: {
      name: 'UNLOAD CONVEYOR',
      status: false,
      modeActive: false,
      controllerActive: true,
      programActive: false,
      positionActive: false,
      speedActive: false,
      jogActive: false,
      actualPos: '0 mm',
      actualSpeed: '0%',
      jogSpeed: '10%'
    },
    gantry1: {
      name: 'GANTRY 1',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: 'X:500 Y:300',
      actualSpeed: '60%',
      jogSpeed: '10%'
    },
    gantry2: {
      name: 'GANTRY 2',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: 'X:750 Y:450',
      actualSpeed: '70%',
      jogSpeed: '10%'
    },
    gantry1Y: {
      name: 'GANTRY 1 Y',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: '300 mm',
      actualSpeed: '55%',
      jogSpeed: '10%'
    },
    gantry1X: {
      name: 'GANTRY 1 X',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: '500 mm',
      actualSpeed: '60%',
      jogSpeed: '10%'
    },
    gantry2Y: {
      name: 'GANTRY 2 Y',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: '450 mm',
      actualSpeed: '65%',
      jogSpeed: '10%'
    },
    gantry2X: {
      name: 'GANTRY 2 X',
      status: true,
      modeActive: true,
      controllerActive: true,
      programActive: true,
      positionActive: true,
      speedActive: true,
      jogActive: false,
      actualPos: '750 mm',
      actualSpeed: '70%',
      jogSpeed: '10%'
    }
  };

  // toggleStatus(device: string, property: string) {
  //   this.devices[device][property] = !this.devices[device][property];
  // }
}
