import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { GuestComponent } from './guest/guest.component';




@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    GuestComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
    SharedModule
  ]
})
export class AuthModule { }
