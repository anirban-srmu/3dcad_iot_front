// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './Auth/authentication/sign-in/sign-in.component';
import { UsersComponent } from './components/Admin/users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './shared/auth.guard';







const routes: Routes = [
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: '/auth/signin',
            pathMatch: 'full'
          },
          // { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] }
           { path: 'dashboard', component: DashboardComponent }
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
