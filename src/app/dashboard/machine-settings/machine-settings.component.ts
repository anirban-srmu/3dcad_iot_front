import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AccessPolicyComponent } from 'src/app/components/Admin/access-policy/access-policy.component';

import { AlarmMasterComponent } from 'src/app/components/Admin/alarm-master/alarm-master.component';
import { ApiMasterComponent } from 'src/app/components/Admin/api-master/api-master.component';
import { MachineConfigComponent } from 'src/app/components/Admin/machine-config/machine-config.component';

import { UsersComponent } from 'src/app/components/Admin/users/users.component';



@Component({
  selector: 'app-machine-settings',
  standalone: true,
  imports: [CommonModule,RouterModule,NgbNavModule,AlarmMasterComponent,MachineConfigComponent,ApiMasterComponent,UsersComponent,AccessPolicyComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './machine-settings.component.html',
  styleUrl: './machine-settings.component.scss'
})
export class MachineSettingsComponent {

 // title = 'Master Data Management';

}
