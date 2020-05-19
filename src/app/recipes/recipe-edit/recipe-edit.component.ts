import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipe: Recipe = new Recipe('','','',[]);


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // jesli params['id'] == null -> tworzony jest nowy, a jak != null to jest edytowany
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    // let recipeName = '';
    // let recipeImagePath = '';
    // let recipeDescription = '';
    // let recipeIngredients = [];

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      this.recipe.name = recipe.name;
      this.recipe.imagePath = recipe.imagePath;
      this.recipe.description = recipe.description;
      this.recipe.ingredients = recipe.ingredients;
    //   recipeName = recipe.name;
    //   recipeImagePath = recipe.imagePath;
    //   recipeDescription = recipe.description;
    //   if (recipe['ingredients']) {
    //     for (let ingredient of recipe.ingredients) {
    //       recipeIngredients.push(
    //         new FormGroup({
    //           name: new FormControl(ingredient.name, Validators.required),
    //           amount: new FormControl(ingredient.amount, [
    //             Validators.required,
    //             Validators.pattern(/^(\d*\.)?\d+$/)
    //           ]),
    //           unit: new FormControl(ingredient.unit)
    //         })
    //       );
    //     }
    //   }
    }

    // this.recipeForm = new FormGroup({
    //   name: new FormControl(recipeName, Validators.required),
    //   imagePath: new FormControl(recipeImagePath, Validators.required),
    //   description: new FormControl(recipeDescription, Validators.required),
    //   ingredients: recipeIngredients,
    // });
  }


  onSubmit(form: NgForm) {
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipe);
      this.editMode=false;
      this.router.navigate(['../'], {relativeTo: this.route, queryParamsHandling: 'preserve'})
    } else {
      this.recipeService.addRecipe(this.recipe);
      let newIndex = this.recipeService.getIndexOfLastRecipe();
      this.editMode=false;
      this.router.navigate(['../', newIndex], {relativeTo: this.route, queryParamsHandling: 'preserve'})
    }

    // let name = this.recipeForm.get('name').value;
    // let imagePath = this.recipeForm.get('imagePath').value;
    // let description = this.recipeForm.get('description').value;
    // let ingredients = this.recipeForm.get('ingredients').value;
    // const newRecipe = new Recipe(name, description, imagePath,  ingredients);
    // if(this.editMode) {
    //   this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    //   this.editMode=false;
    //   this.router.navigate(['../'], {relativeTo: this.route, queryParamsHandling: 'preserve'})
    // } else {
    //   this.recipeService.addRecipe(this.recipeForm.value);
    //   let newIndex = this.recipeService.getIndexOfLastRecipe();
    //   this.editMode=false;
    //   this.router.navigate(['../', newIndex], {relativeTo: this.route, queryParamsHandling: 'preserve'})
    // }

  }

  onAddIngredient() {
    this.recipe.ingredients.push(new Ingredient('',null,''));
  //   (<FormArray>this.recipeForm.get('ingredients')).push(
  //     new FormGroup({
  //       'name': new FormControl(null, Validators.required),
  //       'amount': new FormControl(null, [Validators.required, Validators.pattern(/^(\d*\.)?\d+$/)]),
  //       'unit': new FormControl(null)
  //     })
  //   )
  }

  onDelete(index: number) {
    this.recipe.ingredients.splice(index, 1);
  //   (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
