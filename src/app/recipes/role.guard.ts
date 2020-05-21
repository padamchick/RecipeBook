import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | import('rxjs').Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(
      // pobierz wartosc tylko raz i od razu odsubscribuj
      take(1),
      map((user) => {
        if (!!user && user.email !== 'guest@gmail.com') {
          return true;
        }
        return this.router.createUrlTree(['../']);
      })
    );
  }
}
