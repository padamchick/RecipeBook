import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = true;
  isLoading = false;
  loadingSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadingSub = this.authService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  onChangeMode(event) {
    if (event.index === 0) {
      this.loginMode = true;
    } else {
      this.loginMode = false;
    }
  }

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }
}
