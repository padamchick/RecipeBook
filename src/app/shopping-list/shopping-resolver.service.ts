import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { ShoppingListService } from './shopping-list.service';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingResolverService implements Resolve<Ingredient[]> {
  constructor(
    private shoppingService: ShoppingListService,
    private dataStorageService: DataStorageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Ingredient[] | Observable<Ingredient[]> | Promise<Ingredient[]> {
    const ingredients = this.shoppingService.getIngredients();
    if (ingredients.length === 0) {
      return this.dataStorageService.fetchIngredients();
    } else {
      return ingredients;
    }
  }
}
