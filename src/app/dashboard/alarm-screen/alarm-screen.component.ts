import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Alarm {
  date: string;
  time: string;
  alarmCode: string;
  message: string;
  timestamp?: Date; // For sorting/filtering
}


@Component({
  selector: 'app-alarm-screen',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './alarm-screen.component.html',
  styleUrl: './alarm-screen.component.scss'
})
export class AlarmScreenComponent {

  alarms: Alarm[] = [];
  filteredAlarms: Alarm[] = [];
  
  // Filter controls
  startDate: string | undefined;
  endDate: string | undefined;
  
  // Table sorting
  sortColumn: keyof Alarm = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() { }

  ngOnInit(): void {
    // Mock data - replace with actual API call
    this.loadAlarms();
  }

  loadAlarms(): void {
    // This would be an API call in a real application
    this.alarms = [
      { date: '2023-05-15', time: '08:23:45', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-15T08:23:45') },
      { date: '2023-05-15', time: '10:15:32', alarmCode: 'ALM-205', message: 'Pressure threshold exceeded', timestamp: new Date('2023-05-15T10:15:32') },
      { date: '2023-05-16', time: '14:45:11', alarmCode: 'ALM-301', message: 'Low fuel level', timestamp: new Date('2023-05-16T14:45:11') },
      { date: '2023-05-17', time: '09:30:22', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-17T09:30:22') },
      { date: '2023-05-18', time: '16:20:05', alarmCode: 'ALM-410', message: 'System overload', timestamp: new Date('2023-05-18T16:20:05') },
      { date: '2023-05-15', time: '10:15:32', alarmCode: 'ALM-205', message: 'Pressure threshold exceeded', timestamp: new Date('2023-05-15T10:15:32') },
      { date: '2023-05-16', time: '14:45:11', alarmCode: 'ALM-301', message: 'Low fuel level', timestamp: new Date('2023-05-16T14:45:11') },
      { date: '2023-05-17', time: '09:30:22', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-17T09:30:22') },
      { date: '2023-05-18', time: '16:20:05', alarmCode: 'ALM-410', message: 'System overload', timestamp: new Date('2023-05-18T16:20:05') },
      { date: '2023-05-15', time: '10:15:32', alarmCode: 'ALM-205', message: 'Pressure threshold exceeded', timestamp: new Date('2023-05-15T10:15:32') },
      { date: '2023-05-16', time: '14:45:11', alarmCode: 'ALM-301', message: 'Low fuel level', timestamp: new Date('2023-05-16T14:45:11') },
      { date: '2023-05-17', time: '09:30:22', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-17T09:30:22') },
      { date: '2023-05-18', time: '16:20:05', alarmCode: 'ALM-410', message: 'System overload', timestamp: new Date('2023-05-18T16:20:05') },
      { date: '2023-05-15', time: '10:15:32', alarmCode: 'ALM-205', message: 'Pressure threshold exceeded', timestamp: new Date('2023-05-15T10:15:32') },
      { date: '2023-05-16', time: '14:45:11', alarmCode: 'ALM-301', message: 'Low fuel level', timestamp: new Date('2023-05-16T14:45:11') },
      { date: '2023-05-17', time: '09:30:22', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-17T09:30:22') },
      { date: '2023-05-18', time: '16:20:05', alarmCode: 'ALM-410', message: 'System overload', timestamp: new Date('2023-05-18T16:20:05') },
      { date: '2023-05-15', time: '10:15:32', alarmCode: 'ALM-205', message: 'Pressure threshold exceeded', timestamp: new Date('2023-05-15T10:15:32') },
      { date: '2023-05-16', time: '14:45:11', alarmCode: 'ALM-301', message: 'Low fuel level', timestamp: new Date('2023-05-16T14:45:11') },
      { date: '2023-05-17', time: '09:30:22', alarmCode: 'ALM-102', message: 'High temperature warning', timestamp: new Date('2023-05-17T09:30:22') },
      { date: '2023-05-18', time: '16:20:05', alarmCode: 'ALM-410', message: 'System overload', timestamp: new Date('2023-05-18T16:20:05') }
    ];
    
    this.filteredAlarms = [...this.alarms];
  }

  applyFilters(): void {
    if (!this.startDate && !this.endDate) {
      this.filteredAlarms = [...this.alarms];
      return;
    }

    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredAlarms = this.alarms.filter(alarm => {
      const alarmDate = new Date(alarm.date);
      
      const afterStart = !start || alarmDate >= start;
      const beforeEnd = !end || alarmDate <= end;
      
      return afterStart && beforeEnd;
    });
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.filteredAlarms = [...this.alarms];
  }

  exportData(): void {
    // In a real app, this would export to CSV or Excel
    const dataToExport = this.filteredAlarms.map(alarm => ({
      Date: alarm.date,
      Time: alarm.time,
      'Alarm Code': alarm.alarmCode,
      Message: alarm.message
    }));
    
    console.log('Exporting data:', dataToExport);
    // Implement actual export logic here
    alert('Export functionality would be implemented here');
  }

  sortTable(column: keyof Alarm): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAlarms.sort((a, b) => {
      // Special handling for date/time sorting
      if (column === 'date' || column === 'time') {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // const valueA = a[column].toString().toLowerCase();
      // const valueB = b[column].toString().toLowerCase();
      
      // if (valueA < valueB) {
      //   return this.sortDirection === 'asc' ? -1 : 1;
      // }
      // if (valueA > valueB) {
      //   return this.sortDirection === 'asc' ? 1 : -1;
      // }
      return 0;
    });
  }

  isCritical(alarmCode: string): boolean {
    // Define which alarm codes should be considered critical
    const criticalCodes = ['ALM-205', 'ALM-410'];
    return criticalCodes.includes(alarmCode);
  }
  getSortIcon(column: keyof Alarm): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-mode', this.isDarkMode);
}

  
}
