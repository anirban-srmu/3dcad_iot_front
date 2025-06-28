import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts'; // Import ECharts here
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/configuration/WebsocketService';
import { IndexedDbService } from 'src/app/services/IndexedDbService';

@Component({
  selector: 'app-machine-oee',
  standalone: true,
  imports: [CommonModule,
    NgxEchartsModule, FormsModule],
  templateUrl: './machine-oee.component.html',
  styleUrl: './machine-oee.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideEchartsCore({ echarts }), // Provide the ECharts core
    { provide: 'NGX_ECHARTS_CONFIG', useValue: { /* your config here */ } } // Provide the configuration
  ]
})
export class MachineOeeComponent implements OnInit, OnDestroy {

  connectionId="oee-status";
  constructor(private wsService: WebsocketService,private idbService:IndexedDbService) { }

    ngOnDestroy(): void {
    this.wsService.closeConnection(this.connectionId);
    this.wsService.ngOnDestroy();
  }
faultData:any;
  async ngOnInit(): Promise<void> {
    this.wsService.initConnection(this.connectionId);
    this.wsService.getMessages(this.connectionId).subscribe((msg: string) => {
      try {
        this.data = JSON.parse(msg);

      } catch (e) {
        console.error('Error parsing message:', e);
      }
    });

    this.alarmmessage= await  this.idbService.getAlarm(this.data.alarmSignals);
    console.log(this.idbService.getAlarm(this.data.alarmSignals),"this.alarmmessage");
  }


// getFaultMessage(faultKey: number | string): string {
//   // 1. Ensure faultData exists and has faultCodes
//      this.faultData = localStorage.getItem('data');
//     this.faultData = JSON.parse(this.faultData);
//   if (!this.faultData || !this.faultData.faultCodes) {
//     console.error('Fault codes data not initialized');
//     return 'Fault data not available';
//   }

//   // 2. Convert key to string and trim whitespace
//   const key = faultKey.toString().trim();

//   // 3. Check if key exists
//   if (!(key in this.faultData.faultCodes)) {
//     console.warn(`No fault message found for code: ${key}`);
//     return 'No alarm message';
//   }

//   // 4. Return the message
//   return this.faultData.faultCodes[key];
// }
alarmmessage:any;

  data = {

      cycleRunning: true,
      idle: false,
      stopped: false,
      breakdown: false,
      maintenanceMode: false,
      machineAvailabilityStatus: true,
      plannedDowntimeStatus: false,
      cycleStartStop: true,
      alarmSignals: "2",
      cycleTime: 45,
      targetCycleTime: 50,
      okParts: 230,
      nokParts: 12,
      nrParts:12,
      skParts:12,
      totalParts: 242,
      shiftA_OK_Parts: 80,
      shiftA_Nok_Parts: 3,
      shiftA_NR_Parts: 3,
      shiftA_SK_Parts: 3,
      shiftA_TotalParts: 83,
      shiftB_OK_Parts: 90,
      shiftB_Nok_Parts: 4,
      shiftB_NR_Parts: 4,
      shiftB_SK_Parts: 4,
      shiftB_TotalParts: 94,
      shiftC_OK_Parts: 60,
      shiftC_Nok_Parts: 5,
      shiftC_NR_Parts: 5,
      shiftC_SK_Parts: 5,
      shiftC_TotalParts: 65
  };


  partsQualityOptions = {
    title: {
      text: 'Parts Quality',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#28a745'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: '#28a745'
      }
    },
    series: [
      {
        name: 'Parts',
        type: 'pie',
        radius: ['40%', '70%'], // donut shape
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            const total = this.data.okParts + this.data.nokParts;
            const okRate = total > 0 ? ((this.data.okParts / total) * 100).toFixed(1) : '0';
            return `{a|${okRate}%}\n{b|OK Rate}`;
          },
          rich: {
            a: {
              fontSize: 20,
              fontWeight: 'bold',
              color: '#28a745'
            },
            b: {
              fontSize: 12,
              color: '#888'
            }
          }
        },
        emphasis: {
          label: {
            show: true
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: this.data.okParts, name: 'OK' },
          { value: this.data.nokParts, name: 'NOK' }
        ],
        color: ['#52dfc3', '#dc3545']
      }
    ]
  };


}
