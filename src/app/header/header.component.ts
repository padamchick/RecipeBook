import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;
  isAdminMode = false;

  routes = [
    { name: 'Authentication', route: '/auth', needAuthentication: false },
    { name: 'Recipes', route: '/recipes', needAuthentication: true },
    {
      name: 'Shopping List',
      route: '/shopping-list',
      needAuthentication: true,
    },
  ];
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    public recipeService: RecipeService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      if(user) {
        this.isAuthenticated = true;
        if(user.email==='guest@gmail.com') {
          this.isAdminMode = false;
        } else {
          this.isAdminMode = true;
        }
      } else {
        this.isAuthenticated = false;
      }
    });

  }

  onFetchData() {
    this.dataStorageService.fetchData().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
