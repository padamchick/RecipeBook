import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { map, tap, take, filter } from 'rxjs/operators';
import {
  ConfirmationDialogModel,
  ConfirmationDialogComponent,
} from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe = new Recipe('', '', '', []);
  id: number;
  displayedColumns: string[] = ['name', 'amount', 'unit'];
  dataSource: MatTableDataSource<Ingredient>;
  isAdminMode: boolean;
  adminModeSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataStorageService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id);
      this.dataSource = new MatTableDataSource(this.recipe.ingredients);
    });

    // sprawdzenie czy wlaczony tryb admina
    this.authService.user.subscribe((user) => {
      user.email === 'guest@gmail.com'
        ? (this.isAdminMode = false)
        : (this.isAdminMode = true);
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    const message = 'Are you sure you want to delete this recipe?';

    const dialogData = new ConfirmationDialogModel('Confirm Delete', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => result === true))
      .subscribe((dialogResult) => {
        this.recipeService.deleteRecipe(this.id);
        this.dataService.storeRecipes();
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
