import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  isLoading = false;
  // isLoginMode = true;
  error: string = null;

  constructor(private authService: AuthService,
    private router: Router) {}

  // onSwitchMode() {
  //   this.isLoginMode = !this.isLoginMode;
  // }

  onSubmit(form: NgForm) {
    this.authService.isLoading.next(true);
    // opcjonalnie, ekstra zabezpieczenie, bo mamy i tak wylaczony przycisk jesli formularz invalid
    if (!form.valid) {
      this.authService.isLoading.next(false);
      return;
    }
    const email = form.value.email;
    const password = form.value.password;


    this.authService.signup(email, password).subscribe(
      (responsedata) => {
        // console.log(responsedata);
        console.log('Handle success');
        this.isLoading=false;
        this.authService.isLoading.next(false);
        console.log('Handle success 2');

        this.router.navigate(['./recipes'])
      },
      errorMessage => {
        // console.log(errorMessage);
        console.log('Handle error');
        this.isLoading=false;
        this.authService.isLoading.next(false);
        this.error = errorMessage;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
