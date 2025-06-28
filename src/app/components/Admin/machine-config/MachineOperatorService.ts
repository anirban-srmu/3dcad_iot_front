// machine-operator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MachineOperator {
  id?: number;
  machineId: string;
  operatorId: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MachineOperatorService {
  private apiUrl = 'http://your-backend-api-url'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<MachineOperator[]> {
    return this.http.get<MachineOperator[]>(`${this.apiUrl}/records`);
  }

  create(record: MachineOperator): Observable<MachineOperator> {
    return this.http.post<MachineOperator>(`${this.apiUrl}/records`, record);
  }

  update(record: MachineOperator): Observable<MachineOperator> {
    return this.http.put<MachineOperator>(`${this.apiUrl}/records/${record.id}`, record);
  }
}