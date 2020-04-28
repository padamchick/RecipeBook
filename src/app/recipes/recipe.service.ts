import { Injectable} from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Ribs', 'This is simply a test',
    'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    [
      new Ingredient('Ribs', 1),
      new Ingredient('French Fries', 20)
    ]),
    new Recipe('Shakshuka', 'This a second recipe',
    'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2018/12/Shakshuka-19.jpg',
    [
      new Ingredient('Can of tomatoes', 1),
      new Ingredient('Eggs', 3),
      new Ingredient('Bread', 2)
    ])
  ];

  constructor(private shoppingListService: ShoppingListService){}

  getRecipes() {
    // dzieki .slice() dostajemy kopie tablicy, nie mozemy jej modyfikowac z zewnatrz
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

}
