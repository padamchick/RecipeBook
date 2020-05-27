import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CanComponentDeactivate } from '../../shared/can-deactivate.guard';
import { Observable, Subject, Observer } from 'rxjs';
import {
  ConfirmationDialogModel,
  ConfirmationDialogComponent,
} from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IngredientEditModel, IngredientEditComponent } from 'src/app/shared/ingredient-edit/ingredient-edit.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, CanComponentDeactivate {
  id: number;
  editMode = false;
  // changesSaved = false;
  recipe: Recipe = new Recipe('', '', '', []);
  displayedColumns: string[] = ['name', 'amount', 'unit', 'action'];
  dataSource: MatTableDataSource<Ingredient>;

  constructor(
    private route: ActivatedRoute,
    public recipeService: RecipeService,
    private router: Router,
    private dataService: DataStorageService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      // jesli params['id'] == null -> tworzony jest nowy, a jak != null to jest edytowany
      this.editMode = params['id'] != null;
      this.initForm();
    });

    this.dataSource = new MatTableDataSource(this.recipe.ingredients);
  }

  private initForm() {
    if (this.editMode) {
      // let oldRecipe = this.recipeService.getRecipe(this.id);
      let recipe = JSON.parse(
        JSON.stringify(this.recipeService.getRecipe(this.id))
      );
      this.recipe.name = recipe.name;
      this.recipe.imagePath = recipe.imagePath;
      this.recipe.description = recipe.description;
      this.recipe.ingredients = recipe.ingredients;
    }
  }

  onSubmit(form: NgForm) {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipe);
      this.editMode = false;
      this.router.navigate(['../'], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve',
      });
    } else {
      this.recipeService.addRecipe(this.recipe);
      let newIndex = this.recipeService.getIndexOfLastRecipe();
      this.editMode = false;
      this.router.navigate(['../', newIndex], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve',
      });
    }
    this.dataService.storeRecipes();
  }

  addIngredient() {
    const title = 'Add Ingredient';
    const dialogData = new IngredientEditModel(
      title,
      '',
      null,
      ''
    );
    const dialogRef = this.dialog.open(IngredientEditComponent, {
      maxWidth: '400px',
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(filter((result: Ingredient) => !!result))
      .subscribe((result) => {
        this.recipe.ingredients.push(result);
        this.dataSource = new MatTableDataSource(this.recipe.ingredients);
      });
  }

  editIngredient(el: Ingredient, i: number) {
    const title = 'Edit Ingredient';

    const dialogData = new IngredientEditModel(
      title,
      el.name,
      el.amount,
      el.unit
    );
    const dialogRef = this.dialog.open(IngredientEditComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result: Ingredient) => !!result))
      .subscribe((result) => {
        el.name = result.name;
        el.amount = result.amount;
        el.unit = result.unit;
      });

  }

  onDelete(index: number) {
    this.recipe.ingredients.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.recipe.ingredients)
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  deleteIngredient(el: Ingredient, i: number) {
    this.recipe.ingredients.splice(i, 1);
    this.dataSource = new MatTableDataSource(this.recipe.ingredients);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const recipe = this.recipeService.getRecipe(this.id);

    const subject = new Subject<boolean>();

    if (!recipe) {
      return true;
    }
    // console.log(
    //   JSON.stringify(recipe.ingredients) ===
    //     JSON.stringify(this.recipe.ingredients)
    // );
    if (
      this.recipe.description === recipe.description &&
      this.recipe.imagePath === recipe.imagePath &&
      this.recipe.name === recipe.name &&
      JSON.stringify(recipe.ingredients) ===
        JSON.stringify(this.recipe.ingredients)
    ) {
      return true;
    } else {
      // jesli nastapila zmiana w formularzu:
      return Observable.create((observer: Observer<boolean>) => {
        const message = 'Are you sure you want to discard all changes?';
        const dialogData = new ConfirmationDialogModel(
          'Confirm Exit',
          message,
          'Discard'
        );
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxWidth: '400px',
          data: dialogData,
        });

        dialogRef.afterClosed().subscribe(
          (result: boolean) => {
            observer.next(result);
            observer.complete();
          },
          (error) => {
            observer.next(false);
            observer.complete();
          }
        );
      });
    }
  }
}
