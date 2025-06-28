import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-access-policy',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './access-policy.component.html',
  styleUrl: './access-policy.component.scss'
})
export class AccessPolicyComponent {
  roles = ['Admin', 'Operator', 'Viewer'];
  selectedRole = this.roles[0];

  permissions = [
    'Home Screen',
    'IOStatus',
    'Sensors',
    'Manual',
    'Robot',
    'Oee',
    'Alaram',
    'Recipe',
    'Settings'
  ];

  policy: { [key: string]: boolean } = {};

  constructor() {
    // Initialize all permissions to false
    this.permissions.forEach(p => (this.policy[p] = false));
    this.policy['READ PLC'] = false;
    this.policy['WRITE PLC'] = false;
  }

  savePolicy() {
    console.log('Selected Role:', this.selectedRole);
    console.log('Policy:', this.policy);
    alert('Policy saved successfully!');
  }
}