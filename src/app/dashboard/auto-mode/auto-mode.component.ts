import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { WebsocketService } from 'src/app/configuration/WebsocketService';

@Component({
  selector: 'app-auto-mode',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [WebsocketService],
  templateUrl: './auto-mode.component.html',
  styleUrls: ['./auto-mode.component.scss']
})
export class AutoModeComponent implements OnInit, OnDestroy {

  constructor(private readonly router: Router,private wsService: WebsocketService) {}
  counts: any[] = [];
  private subscription!: Subscription;


  // Current pair (live from PLC or simulated)
  currentPair = {
    barcode1: 'SCAN123456789',
    barcode2: 'SCAN987654321',
    barcode1Stages: [
      'success', 'danger', 'warning', 'success', 'success', 'danger',
      'success', 'success', 'warning', 'danger', 'success', 'info', 'success'
    ],
    barcode2Stages: [
      'danger', 'success', 'success', 'warning', 'success', 'info',
      'danger', 'success', 'warning', 'success', 'danger', 'info', 'success'
    ],
    barcode3Stages: [
      'danger', 'success', 'success', 'warning', 'success', 'info',
      'danger', 'success', 'warning', 'success', 'danger', 'info', 'success'
    ],
    barcode4Stages: [
      'danger', 'success', 'success', 'warning', 'success', 'info',
      'danger', 'success', 'warning', 'success', 'danger', 'info', 'success'
    ]
  };

  barcodePairs: Array<{
    barcode1: string;
    barcode2: string;
    barcode1Stages: string[];
    barcode2Stages: string[];
  }> = [];



  stageHeaders = [
  'InputStation', 'Trace', 'Process', 'MES', 'Transfer-1',
  'Vision-1', 'PickPlace-1', 'Transfer-2', 'Vision-2',
  'PickPlace-2', 'TraceUpload', 'MESUpload', 'UnloadStation'
];

  // Alarm and machine messages
  alarmMessage = 'No alarms detected';
  machineMessage = 'Machine operating normally';

  okCount = 0;
  ngCount = 0;
  nrCount = 0;
  skippedCount = 0;
  barcode_1?: string;
  barcode_2?: string;
  barcode_3?: string;
  barcode_4?: string;
  alaram = 0;

  ngOnInit() {

  this.wsService.initConnection('machine-status');
  this.subscription = this.wsService.getMessages().subscribe((msg: string) => {
    try {
      const data = JSON.parse(msg);
      this.okCount = data.OK || 0;
      this.ngCount = data.NOK || 0;
      this.nrCount = data.NR || 0;
      this.skippedCount = data.SKIP || 0;
      this.barcode_1 = data.BARCODE_1;
      this.barcode_2 = data.BARCODE_2;
      this.barcode_3 = data.BARCODE_3;
      this.barcode_4 = data.BARCODE_4;
      this.alaram = data.ALARM;
    const set1 = data.set1[0];
    const set2 = data.set2[0];
this.barcodes = [
  {
    name: 'ABC123',
    stages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: 'XYZ456',
    stages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: 'LMN789',
    stages: [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0]
  },
  {
    name: 'PQR000',
    stages: [1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1]
  }
];


    } catch (e) {
      console.error('Invalid JSON:', msg);
    }
  });
  console.log("PLSC DATA",this.barcodes);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.wsService.ngOnDestroy();
  }


  generateRandomBarcode(): string {
    return 'SCAN' + Math.floor(100000000 + Math.random() * 900000000);
  }

  randomizeStages(length: number): string[] {
    const statuses = ['success', 'danger', 'warning', 'info'];
    return Array.from({ length }, () => statuses[Math.floor(Math.random() * statuses.length)]);
  }

  getStageClass(color: string): string {
    switch (color) {
      case 'success': return 'table-success';
      case 'danger': return 'table-danger';
      case 'warning': return 'table-warning';
      case 'info': return 'table-info';
      default: return '';
    }
  }

  getStageIcon(color: string): string | null {
    switch (color) {
      case 'success': return 'fas fa-check-circle text-success';
      case 'danger': return 'fas fa-times-circle text-danger';
      case 'warning': return 'fas fa-exclamation-circle text-warning';
      case 'info': return 'fas fa-question-circle text-info';
      default: return null;
    }
  }

  goBackHome() {
    this.router.navigate(['/']); // your home route
  }
barcodes:any;








}
