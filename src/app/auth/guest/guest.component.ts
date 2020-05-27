import { Component} from '@angular/core';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent{

  isLoading = false;
  // isLoginMode = true;
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
    const email = 'guest@gmail.com';
    const password = '1234As';

    this.authService.login(email, password).subscribe(
      (responsedata) => {
        // console.log(responsedata);
      this.authService.isLoading.next(false);
      this.router.navigate(['./recipes'])
      },
      errorMessage => {
        // console.log(errorMessage);
        // console.log('Handle error');
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
