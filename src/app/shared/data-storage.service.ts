import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap, take, exhaustMap } from "rxjs/operators";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Ingredient } from './ingredient.model';

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private shoppingService: ShoppingListService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://course-recipe-book-30496.firebaseio.com/recipes.json",
        recipes
      )
      .subscribe((response) => {
        // console.log(response);
      });
  }

  fetchData() {

    return this.http
      .get<Recipe[]>(
        "https://course-recipe-book-30496.firebaseio.com/recipes.json",
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              // pobierz wszystkie wlasciwosci recipe
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

  storeIngredients() {
    const ingredients = this.shoppingService.getIngredients();
    this.http
      .put(
        "https://course-recipe-book-30496.firebaseio.com/ingredients.json",
        ingredients
      )
      .subscribe((response) => {
         console.log(response);
      });
  }

  fetchIngredients() {

    return this.http
      .get<Ingredient[]>(
        "https://course-recipe-book-30496.firebaseio.com/ingredients.json",
      )
      .pipe(
        map((ingredients) => {
          if (!ingredients) {
            return [];
          } else {
            return ingredients
          }
        }),
        tap((ingredients) => {
          this.shoppingService.setIngredients(ingredients);
        })
      );
  }
}
