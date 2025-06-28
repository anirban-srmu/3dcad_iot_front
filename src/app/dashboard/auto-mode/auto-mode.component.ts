import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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
  counts: any[] = [];
  private subscription!: Subscription;
  private alarmSubscription!: Subscription;

  stageHeaders = [
    'Input Station', 'Trace-InterLock', 'Process-Control', 'MES-Process', 'Transfer-1',
    'Vision-1', 'PickPlace-1', 'Transfer-2', 'Vision-2',
    'PickPlace-2', 'TraceUpload', 'MESUpload', 'UnloadStation'
  ];

  // Status variables with initial values
  alarmMessage = 'No alarms detected';
  okCount = 0;
  ngCount = 0;
  nrCount = 0;
  skippedCount = 0;
  alaram = 0;
  machineMessage = 0;
  barcodes: any[] = [];
  barcodePairs: any;
connectionId="machine-status"
connectionId1="auto-status"
  constructor(
    private readonly router: Router, 
    private wsService: WebsocketService
  ) { }

  ngOnInit() {
       this.loadBarcodeHistory();
    this.initWebSocketConnections();
  }

  private initWebSocketConnections() {
    // Initialize machine-status connection
    this.wsService.initConnection(this.connectionId);
    this.subscription = this.wsService.getMessages(this.connectionId).subscribe({
      next: (msg: string) => this.handleMachineStatusMessage(msg),
      error: (err) => console.error('Machine-status WebSocket error:', err)
    });

    // Initialize auto-status connection
    this.wsService.initConnection(this.connectionId1);
    this.alarmSubscription = this.wsService.getMessages(this.connectionId1).subscribe({
      next: (msg: any) => this.handleAutoStatusMessage(msg),
      error: (err) => console.error('Auto-status WebSocket error:', err)
    });
  }

   private readonly BARCODE_HISTORY_KEY = 'barcodeHistory';
  private readonly MAX_HISTORY_ITEMS = 3;
  barcodeHistory: any[] = [];

  private loadBarcodeHistory() {
    const history = localStorage.getItem(this.BARCODE_HISTORY_KEY);
    this.barcodeHistory = history ? JSON.parse(history) : [];
  }

private saveBarcodeData(currentData: any) {
  const historyEntry = {
    timestamp: new Date().toISOString(),
    data: {
      set1: {
        barcode1: currentData.set1.barcode1,
        barcode2: currentData.set1.barcode2,
        InputStation: currentData.set1.InputStation,
        Trace: currentData.set1.Trace,
        Process: currentData.set1.Process,
        MES: currentData.set1.MES,
        'Transfer-1': currentData.set1['Transfer-1'],
        'Vision-1': currentData.set1['Vision-1'],
        'PickPlace-1': currentData.set1['PickPlace-1'],
        'Transfer-2': currentData.set1['Transfer-2'],
        'Vision-2': currentData.set1['Vision-2'],
        'PickPlace-2': currentData.set1['PickPlace-2'],
        TraceUpload: currentData.set1.TraceUpload,
        MESUpload: currentData.set1.MESUpload,
        UnloadStation: currentData.set1.UnloadStation
      },
      set2: {
        barcode3: currentData.set2.barcode3,
        barcode4: currentData.set2.barcode4,
        InputStation: currentData.set2.InputStation,
        Trace: currentData.set2.Trace,
        Process: currentData.set2.Process,
        MES: currentData.set2.MES,
        'Transfer-1': currentData.set2['Transfer-1'],
        'Vision-1': currentData.set2['Vision-1'],
        'PickPlace-1': currentData.set2['PickPlace-1'],
        'Transfer-2': currentData.set2['Transfer-2'],
        'Vision-2': currentData.set2['Vision-2'],
        'PickPlace-2': currentData.set2['PickPlace-2'],
        TraceUpload: currentData.set2.TraceUpload,
        MESUpload: currentData.set2.MESUpload,
        UnloadStation: currentData.set2.UnloadStation
      }
    }
  };

  this.barcodeHistory.unshift(historyEntry);

  if (this.barcodeHistory.length > this.MAX_HISTORY_ITEMS) {
    this.barcodeHistory = this.barcodeHistory.slice(0, this.MAX_HISTORY_ITEMS);
  }

  localStorage.setItem(this.BARCODE_HISTORY_KEY, JSON.stringify(this.barcodeHistory));
}

  private handleMachineStatusMessage(msg: string) {
    try {
      const data = JSON.parse(msg);
      const set1 = data.set1?.[0];
      const set2 = data.set2?.[0];

      if (!set1 || !set2) {
        console.warn('Invalid machine status data structure');
        return;
      }

      this.barcodes = [
        this.createBarcodeEntry(set1, 'barcode1', 'NO BARCODE'),
        this.createBarcodeEntry(set1, 'barcode2', 'NO BARCODE'),
        this.createBarcodeEntry(set2, 'barcode3', 'NO BARCODE'),
        this.createBarcodeEntry(set2, 'barcode4', 'NO BARCODE')
      ];

       this.saveBarcodeData({
        set1: set1,
        set2: set2,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing machine status message:', error);
    }
  }

  private createBarcodeEntry(data: any, barcodeField: string, defaultName: string) {
    return {
      name: data[barcodeField] || defaultName,
      stages: [
        data.InputStation,
        data.Trace,
        data.Process,
        data.MES,
        data['Transfer-1'],
        data['Vision-1'],
        data['PickPlace-1'],
        data['Transfer-2'],
        data['Vision-2'],
        data['PickPlace-2'],
        data.TraceUpload,
        data.MESUpload,
        data.UnloadStation
      ]
    };
  }

  private handleAutoStatusMessage(msg: any) {
    try {
      const raw = typeof msg === 'string' ? msg.trim() : JSON.stringify(msg);
      
      if (!raw || !raw.startsWith('{') || !raw.endsWith('}')) {
        console.warn('Skipped non-JSON message:', msg);
        return;
      }

      const data = JSON.parse(raw);
      this.updateStatusData(data);
    } catch (error) {
      console.error('Error processing auto status message:', error);
    }
  }

  private updateStatusData(data: any) {
    this.okCount = data.OK ?? this.okCount;
    this.ngCount = data?.NOK ?? this.ngCount;
    this.nrCount = data?.NR ?? this.nrCount;
    this.skippedCount = data?.SKIP ?? this.skippedCount;
    this.alaram = data?.ALARM ?? this.alaram;
    this.machineMessage = data?.RUNNING_MSG ?? this.machineMessage;
    
    // Update alarm message based on status
    this.alarmMessage = this.alaram > 0 
      ? `Alarm detected (Code: ${this.alaram})` 
      : 'No alarms detected';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.alarmSubscription?.unsubscribe();
    this.wsService.ngOnDestroy();
  }

  getStageClass(color: any): string {
    const value = String(color);
    switch (value) {
      case '1': return 'table-success';
      case '0': return 'table-danger';
      default: return 'table-secondary';
    }
  }

  getStageIcon(color: any): string | null {
    const value = String(color);
    switch (value) {
      case '1': return 'fas fa-check-circle text-success';
      case '0': return 'fas fa-times-circle text-danger';
      default: return 'fas fa-minus-circle text-secondary';
    }
  }

  goBackHome() {
    this.router.navigate(['/']);
  }
}