import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  error: string = null;

  constructor(private authService: AuthService,
    private router: Router) {}


  onSubmit(form: NgForm) {
    this.authService.isLoading.next(true);
    // opcjonalnie, ekstra zabezpieczenie, bo mamy i tak wylaczony przycisk jesli formularz invalid
    if (!form.valid) {
      this.authService.isLoading.next(false);
      return;
    }
    const email = form.value.email;
    const password = form.value.password;


    this.authService.login(email, password).subscribe(
      (responsedata) => {
        console.log(responsedata);
      this.authService.isLoading.next(false);
      this.router.navigate(['./recipes'])
      },
      errorMessage => {
        // console.log(errorMessage);
        console.log('Handle error');
        this.error = errorMessage;
        this.authService.isLoading.next(false);
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

}
