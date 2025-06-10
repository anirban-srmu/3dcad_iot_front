// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './Auth/authentication/sign-in/sign-in.component';
import { UsersComponent } from './components/Admin/users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/auth.guard';
import { RoleMasterComponent } from './components/Admin/role-master/role-master.component';
import { LevelMasterComponent } from './components/Admin/level-master/level-master.component';
import { StatusMasterComponent } from './components/Admin/status-master/status-master.component';






const routes: Routes = [
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: '/auth/signin',
            pathMatch: 'full'
          },
          { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] }
        ]
  },
  {
    path: 'auth/signin',
    component: SignInComponent,
  },
  {
    path: '**',
    redirectTo: 'auth/signin',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
