import { Component, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent{
  isWelcomePage=false;
  order = "1";

  constructor(private router: Router) { }

  // zabawa routingiem, sprawdz czy welcome page i jesli tak, to wyswietl liste skladnikow pod welcome message
  ngOnInit(): void {
    if(this.router.url === '/recipes') this.isWelcomePage=true;
    this.router.events
    .pipe(filter(event=>event instanceof NavigationEnd))
    .subscribe((event:NavigationEnd) => {
      // console.log(event.url)
        if(event.url === '/' || event.url === '/recipes') {
          this.isWelcomePage = true;
          this.order="1";
        } else {
          this.isWelcomePage = false;
          this.order="3";
        }
    })
  }


}
