import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts'; // Import ECharts here
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

interface MachineStatus {
  cycleRunning: boolean;
  idle: boolean;
  stopped: boolean;
  breakdown: boolean;
  maintenanceMode: boolean;
  availabilityStatus: boolean;
  plannedDowntimeStatus: boolean;
}

interface OeeData {
  machineStatus: MachineStatus;
  cycleControl: { startStop: boolean };
  alarms: { currentAlarm: string; history: string[] };
  productionMetrics: {
    cycleTime: number;
    targetCycleTime: number;
    okParts: number;
    nokParts: number;
    totalParts: number;
  };
  shiftData: {
    shiftA: { okParts: number; nokParts: number; totalParts: number };
    shiftB: { okParts: number; nokParts: number; totalParts: number };
    shiftC: { okParts: number; nokParts: number; totalParts: number };
  };
  oee: {
    availability: number;
    performance: number;
    quality: number;
    overall: number;
  };
}


enum MachineState {
  Running = 0,
  Idle = 1,
  Stopped = 2,
  Breakdown = 3,
  Maintenance = 4,
  PlannedDowntime = 5
}



@Component({
  selector: 'app-machine-oee',
  standalone: true,
  imports: [CommonModule,
    NgxEchartsModule,FormsModule],
  templateUrl: './machine-oee.component.html',
  styleUrl: './machine-oee.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideEchartsCore({ echarts }), // Provide the ECharts core
    { provide: 'NGX_ECHARTS_CONFIG', useValue: { /* your config here */ } } // Provide the configuration
  ]
})
export class MachineOeeComponent implements OnInit, OnDestroy {


  constructor(private wsService: WebsocketService){}
  isCycleRunning: boolean = false; // Initialize to false or tr
  data: OeeData = {
    machineStatus: {
      cycleRunning: false,
      idle: true,
      stopped: false,
      breakdown: false,
      maintenanceMode: false,
      availabilityStatus: true,
      plannedDowntimeStatus: false
    },
    cycleControl: { startStop: false },
    alarms: { currentAlarm: 'No Alarms', history: [] },
    productionMetrics: {
      cycleTime: 0,
      targetCycleTime: 45,
      okParts: 0,
      nokParts: 0,
      totalParts: 0
    },
    shiftData: {
      shiftA: { okParts: 0, nokParts: 0, totalParts: 0 },
      shiftB: { okParts: 0, nokParts: 0, totalParts: 0 },
      shiftC: { okParts: 0, nokParts: 0, totalParts: 0 }
    },
    oee: {
      availability: 0,
      performance: 0,
      quality: 0,
      overall: 0
    }
  };

  private simulationSub!: Subscription;
  private counter = 0;
  private subscription!: Subscription;
  ngOnInit(): void {
 //   this.startSimulation();

 this.wsService.initConnection('oee-data');
 this.subscription = this.wsService.getMessages().subscribe((msg: string) => {
   try {
     const data = JSON.parse(msg);
     console.error('OEE DATA', data);


   } catch (e) {
     console.error('Invalid JSON:', msg);
   }
 });

  }

  ngOnDestroy(): void {
    this.stopSimulation();
  }

  startSimulation(): void {
    this.simulationSub = interval(2000).subscribe(() => {
      this.counter++;
      this.updateMachineStatus();
      this.updateProductionMetrics();
      this.calculateOEE();
    });
  }

  stopSimulation(): void {
    if (this.simulationSub) {
      this.simulationSub.unsubscribe();
    }
  }

  private updateMachineStatus(): void {
    const state: MachineState = MachineState.Running; // Hardcoded to Running state
    
    // Reset all states
    (Object.keys(this.data.machineStatus) as Array<keyof MachineStatus>).forEach(key => {
        this.data.machineStatus[key] = false;
    });
    
    switch(state) {
        case 0: // Running
            this.data.machineStatus.cycleRunning = true;
            this.data.machineStatus.availabilityStatus = true;
            this.data.alarms.currentAlarm = 'No Alarms';
            break;
        // case 1: // Idle
        //     this.data.machineStatus.idle = true;
        //     this.data.machineStatus.availabilityStatus = true;
        //     break;
        // case 2: // Stopped
        //     this.data.machineStatus.stopped = true;
        //     this.data.machineStatus.availabilityStatus = false;
        //     break;
        // case 3: // Breakdown
        //     this.data.machineStatus.breakdown = true;
        //     this.data.machineStatus.availabilityStatus = false;
        //     this.data.alarms.currentAlarm = 'Motor Overheat';
        //     this.data.alarms.history.unshift(`${new Date().toLocaleTimeString()}: ${this.data.alarms.currentAlarm}`);
        //     break;
        // case 4: // Maintenance
        //     this.data.machineStatus.maintenanceMode = true;
        //     this.data.machineStatus.availabilityStatus = false;
        //     this.data.alarms.currentAlarm = 'Scheduled Maintenance';
        //     break;
        // case 5: // Planned Downtime
        //     this.data.machineStatus.plannedDowntimeStatus = true;
        //     this.data.machineStatus.availabilityStatus = false;
        //     break;
    }
    
    this.data.cycleControl.startStop = this.data.machineStatus.cycleRunning;
}

  private updateProductionMetrics(): void {
    if (this.data.machineStatus.cycleRunning) {
      const cycleVariation = Math.random() * 10 - 5;
      this.data.productionMetrics.cycleTime = Math.max(30, this.data.productionMetrics.targetCycleTime + cycleVariation);
      
      const partsProduced = Math.floor(Math.random() * 5) + 1;
      const defectRate = 0.05;
      const defectiveParts = Math.random() < defectRate ? 1 : 0;
      
      this.data.productionMetrics.okParts += partsProduced - defectiveParts;
      this.data.productionMetrics.nokParts += defectiveParts;
      this.data.productionMetrics.totalParts += partsProduced;
      
      this.updateShiftData();
    }
  }

  private updateShiftData(): void {
    this.data.shiftData.shiftA.okParts = Math.floor(this.data.productionMetrics.okParts * 0.4);
    this.data.shiftData.shiftA.nokParts = Math.floor(this.data.productionMetrics.nokParts * 0.4);
    this.data.shiftData.shiftA.totalParts = this.data.shiftData.shiftA.okParts + this.data.shiftData.shiftA.nokParts;
    
    this.data.shiftData.shiftB.okParts = Math.floor(this.data.productionMetrics.okParts * 0.3);
    this.data.shiftData.shiftB.nokParts = Math.floor(this.data.productionMetrics.nokParts * 0.3);
    this.data.shiftData.shiftB.totalParts = this.data.shiftData.shiftB.okParts + this.data.shiftData.shiftB.nokParts;
    
    this.data.shiftData.shiftC.okParts = this.data.productionMetrics.okParts - this.data.shiftData.shiftA.okParts - this.data.shiftData.shiftB.okParts;
    this.data.shiftData.shiftC.nokParts = this.data.productionMetrics.nokParts - this.data.shiftData.shiftA.nokParts - this.data.shiftData.shiftB.nokParts;
    this.data.shiftData.shiftC.totalParts = this.data.shiftData.shiftC.okParts + this.data.shiftData.shiftC.nokParts;
  }

  private calculateOEE(): void {
    const availability = this.data.machineStatus.availabilityStatus ? 0.95 : 0.6;
    const performance = this.data.productionMetrics.totalParts > 0 ? 
      Math.min(1, (this.data.productionMetrics.totalParts * this.data.productionMetrics.targetCycleTime) / 
      (this.data.productionMetrics.totalParts * this.data.productionMetrics.cycleTime)) : 0;
    const quality = this.data.productionMetrics.totalParts > 0 ? 
      this.data.productionMetrics.okParts / this.data.productionMetrics.totalParts : 0;
    
    this.data.oee = {
      availability: availability * 100,
      performance: performance * 100,
      quality: quality * 100,
      overall: availability * performance * quality * 100
    };
  }

  toggleCycle(): void {
    this.data.cycleControl.startStop = !this.data.cycleControl.startStop;
    this.data.machineStatus.cycleRunning = this.data.cycleControl.startStop;
    this.data.machineStatus.idle = !this.data.cycleControl.startStop;
  }

  gaugeData = [
    {
      value:  85, // Ensure this is a number
      name: 'Overview',
      title: {
        offsetCenter: ['0%', '30%']
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%']
      }
    }
  ];

  gaugeData1 = [
    {
      value:  70, // Ensure this is a number
      name: 'Availability',
      title: {
        offsetCenter: ['0%', '30%']
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%']
      }
    }
  ];

  gaugeData2 = [
    {
      value:  50, // Ensure this is a number
      name: 'Quality',
      title: {
        offsetCenter: ['0%', '30%']
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%']
      }
    }
  ];

  gaugeData3 = [
    {
      value:  90, // Ensure this is a number
      name: 'Perfomance',
      title: {
        offsetCenter: ['0%', '30%']
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', '0%']
      }
    }
  ];

  chartOptions: EChartsOption = {
    series: [
      {
        type: 'gauge',
        radius: '80%', // Set the radius to 70% of the container
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: true
        },
        axisLine: {
          lineStyle: {
            width: 20, // Reduce the width of the axis line
            color: [
              [0.3, '#ff0000'], // 30% red
              [0.7, '#ff0000'], // 70% yellow
              [1, '#ff0000']    // 100% green
          ]
          }
        },
        splitLine: {
          show: true,
          distance: 0,
          length: 5 // Reduce the length of the split lines
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          show: false,
          distance: 60
        },
        data: this.gaugeData,
        title: {
          fontSize: 14, // Adjust title font size
          fontWeight: 'bold' // Make the title bold
        },
        detail: {
          width: 40, // Adjust width of detail
          height: 10, // Adjust height of detail
          fontSize: 44,
          color: 'inherit',
          borderColor: 'inherit',
          // borderRadius: 20,
          // borderWidth: 1,
          formatter: '{value}%' // Keep the formatter
        }
      }
    ]
  };

  chartOptions1: EChartsOption = {
    series: [
      {
        type: 'gauge',
        radius: '80%', // Set the radius to 70% of the container
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: true
        },
        axisLine: {
          lineStyle: {
            width: 20, // Reduce the width of the axis line
            color: [
              [0.3, '#ff0000'], // 30% red
              [0.7, '#ff0000'], // 70% yellow
              [1, '#ff0000']    // 100% green
          ]
          }
        },
        splitLine: {
          show: true,
          distance: 0,
          length: 5 // Reduce the length of the split lines
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          show: false,
          distance: 60
        },
        data: this.gaugeData1,
        title: {
          fontSize: 14, // Adjust title font size
          fontWeight: 'bold' // Make the title bold
        },
        detail: {
          width: 40, // Adjust width of detail
          height: 10, // Adjust height of detail
          fontSize: 44,
          color: 'inherit',
          borderColor: 'inherit',
          // borderRadius: 20,
          // borderWidth: 1,
          formatter: '{value}%' // Keep the formatter
        }
      }
    ]
  };
  chartOptions2: EChartsOption = {
    series: [
      {
        type: 'gauge',
        radius: '80%', // Set the radius to 70% of the container
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: true
        },
        axisLine: {
          lineStyle: {
            width: 20, // Reduce the width of the axis line
            color: [
              [0.3, '#ff0000'], // 30% red
              [0.7, '#ff0000'], // 70% yellow
              [1, '#ff0000']    // 100% green
          ]
          }
        },
        splitLine: {
          show: true,
          distance: 0,
          length: 5 // Reduce the length of the split lines
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          show: false,
          distance: 60
        },
        data: this.gaugeData2,
        title: {
          fontSize: 14, // Adjust title font size
          fontWeight: 'bold' // Make the title bold
        },
        detail: {
          width: 40, // Adjust width of detail
          height: 10, // Adjust height of detail
          fontSize: 44,
          color: 'inherit',
          borderColor: 'inherit',
          // borderRadius: 20,
          // borderWidth: 1,
          formatter: '{value}%' // Keep the formatter
        }
      }
    ]
  };
  chartOptions3: EChartsOption = {
    series: [
      {
        type: 'gauge',
        radius: '80%', // Set the radius to 70% of the container
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: true
        },
        axisLine: {
          lineStyle: {
            width: 20, // Reduce the width of the axis line
            color: [
              [0.3, '#ff0000'], // 30% red
              [0.7, '#ff0000'], // 70% yellow
              [1, '#ff0000']    // 100% green
          ]
          }
        },
        splitLine: {
          show: true,
          distance: 0,
          length: 5 // Reduce the length of the split lines
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          show: false,
          distance: 60
        },
        data: this.gaugeData3,
        title: {
          fontSize: 14, // Adjust title font size
          fontWeight: 'bold' // Make the title bold
        },
        detail: {
          width: 40, // Adjust width of detail
          height: 10, // Adjust height of detail
          fontSize: 44,
          color: 'inherit',
          borderColor: 'inherit',
          // borderRadius: 20,
          // borderWidth: 1,
          formatter: '{value}%' // Keep the formatter
        }
      }
    ]
  };

  isOEEOn: boolean = true; // Initial state of the toggle switch

  toggleOEE() {
    this.isOEEOn = !this.isOEEOn;
    // You can add additional logic here if needed
    console.log('OEE is now:', this.isOEEOn ? 'On' : 'Off');
  }


}