import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

import { map, tap } from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://course-recipe-book-30496.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchData() {
    return this.http.get<Recipe[]>('https://course-recipe-book-30496.firebaseio.com/recipes.json')
    .pipe(
      map(recipes => {
      return recipes.map(recipe => {
        // to map to funkcja js, a map wyżej to operator rxjs. niżej sprawdzamy czy ingredients istnieje, jesli nie to ustawiamy to jako pusta tablice zeby nie miec bledow
        // bo w przypadku braku skladnikow Save data nie zainicjalizuje nam tablicy ingredients i potem przy fetch data bedziemy probowali sie odwolac do nieistniejacego property
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
      })
    }),
    tap(recipes => {
      this.recipeService.setRecipes(recipes);
    }))
    
  }



}
