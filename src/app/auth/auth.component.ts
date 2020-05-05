import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, AuthResponseData } from "./auth.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService,
    private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    // opcjonalnie, ekstra zabezpieczenie, bo mamy i tak wylaczony przycisk jesli formularz invalid
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    authObs.subscribe(
      (responsedata) => {
        // console.log(responsedata);

        this.isLoading = false;
        this.router.navigate(['./recipes'])
      },
      errorMessage => {
        // console.log(errorMessage);
        this.isLoading = false;
        this.error = errorMessage;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
