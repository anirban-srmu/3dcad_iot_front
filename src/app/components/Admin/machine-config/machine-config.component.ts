import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared/shared.module';
import { ToastMessageComponent } from 'src/app/toast-message/toast-message.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MachineOperatorService } from './MachineOperatorService';

interface Equipment {
  id: string;
  machineId: string;
  operatorId: string;
  name: string;
  status: 'enabled' | 'disabled';
  editing?: boolean;
  originalState?: any;
}

@Component({
  selector: 'app-machine-config',
  standalone: true,
  imports: [SharedModule, NgSelectModule, FormsModule, ToastMessageComponent],
  templateUrl: './machine-config.component.html',
  styleUrl: './machine-config.component.scss'
})
export class MachineConfigComponent implements OnInit {

 equipments: Equipment[] = [
    { id: 'EQ-1001', machineId: 'MACH-001', operatorId: 'OP-101', name: 'localhost:8001/cantier-api-v1/process-control', status: 'enabled' },
    { id: 'EQ-1002', machineId: 'MACH-002', operatorId: 'OP-102', name: 'localhost:8001/cantier-api/v1/pass-fail-MI', status: 'disabled' },
    { id: 'EQ-1003', machineId: 'MACH-003', operatorId: 'OP-103', name: 'http://localhost:8003//cantier-api-v1/certification-user-pass', status: 'enabled' },
    { id: 'EQ-1002', machineId: 'MACH-002', operatorId: 'OP-102', name: 'http://127.0.0.1:8765/interlock', status: 'disabled' },
    { id: 'EQ-1003', machineId: 'MACH-003', operatorId: 'OP-103', name: 'http://localhost:8765/v2/process_control', status: 'enabled' }
  ];

 filteredEquipments: Equipment[] = [];
 
    machineIdFilter: string = '';
    operatorIdFilter: string = '';
    showDisabled: boolean = true;

  ngOnInit(): void {
    this.filteredEquipments = [...this.equipments];
  }

   startEditing(equipment: Equipment): void {
    // Save original state in case of cancel
    equipment.originalState = {
      machineId: equipment.machineId,
      operatorId: equipment.operatorId,
      name: equipment.name,
      status: equipment.status
    };
    equipment.editing = true;
  }

  saveEditing(equipment: Equipment): void {
    // Validate inputs if needed
    if (!equipment.machineId || !equipment.operatorId || !equipment.name) {
      alert('All fields are required');
      return;
    }
    
    // In a real app, you would call an API here to save changes
    console.log('Saving changes:', equipment);
    
    equipment.editing = false;
    delete equipment.originalState;
  }

  cancelEditing(equipment: Equipment): void {
    // Restore original values
    if (equipment.originalState) {
      equipment.machineId = equipment.originalState.machineId;
      equipment.operatorId = equipment.originalState.operatorId;
      equipment.name = equipment.originalState.name;
      equipment.status = equipment.originalState.status;
    }
    
    equipment.editing = false;
    delete equipment.originalState;
  }

  toggleEquipmentStatus(equipment: Equipment): void {
    equipment.status = equipment.status === 'enabled' ? 'disabled' : 'enabled';
    // In a real app, you would call an API here
    console.log(`Toggled status for ${equipment.id} to ${equipment.status}`);
  }
 
}