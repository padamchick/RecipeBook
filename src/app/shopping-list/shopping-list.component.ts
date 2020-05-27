import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Subject, Observable, Observer } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortable } from '@angular/material/sort';
import { DataStorageService } from '../shared/data-storage.service';
import {
  IngredientEditModel,
  IngredientEditComponent,
} from '../shared/ingredient-edit/ingredient-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { filter, pairwise } from 'rxjs/operators';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
} from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router, NavigationStart, Event, NavigationEnd } from '@angular/router';
import { CanComponentDeactivate } from '../shared/can-deactivate.guard';

// export class ShoppingIngredient extends Ingredient {
//   constructor(ingredient: Ingredient, private selected = false){
//     super(ingredient.name, ingredient.amount, ingredient.unit);
//   }
// }

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  // ingredients: ShoppingIngredient[];
  ingredients: Ingredient[];
  private ingredientsChangeSub: Subscription;
  initialSelection: Ingredient[] = [];

  // selection data table
  selection;
  displayedColumns: string[] = ['select', 'name', 'amount', 'unit', 'action'];
  dataSource: MatTableDataSource<Ingredient>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public shoppingListService: ShoppingListService,
    private dataService: DataStorageService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.ingredients = this.shoppingListService.getIngredients() ;
    this.ingredients = JSON.parse(
      JSON.stringify(this.shoppingListService.getIngredients())
    );

    // uzupelnij selected = false dla skladnikow bez ustawionego parametru
    this.ingredients
      .filter((ingredient) => !ingredient.isSelected)
      .forEach((ing) => (ing.isSelected = false));

    // uaktualnij zaznaczenia checkboxow
    this.updateSelection();

    this.dataSource = new MatTableDataSource(this.ingredients);

    // uaktualniaj po kazdej zmianie w skladnikach
    this.ingredientsChangeSub = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        // this.ingredients = ingredients;
        this.ingredients = JSON.parse(JSON.stringify(ingredients));
        // zaaktualizuj wyswietlana tabele
        this.dataSource = new MatTableDataSource(this.ingredients);
        this.updateSelection();
      }
    );
  }

  // onSort() {

    // this.sort.sort(({ id: 'name', start: 'asc'}) as MatSortable);
    // this.dataSource.sort = this.sort;

    // zmiana sortowania dotyczy tylko tego, o którym mowa w sortingDataAccessor
    // this.dataSource.sortingDataAccessor = (ingredient, sortHeaderId) => {
    //   switch (sortHeaderId) {
    //     case 'select': return this.selection.isSelected(ingredient);
    //     default: return ingredient[sortHeaderId];
    //   }
    // };
  // }

  // sprawdza, czy wszystkie wiersze są zaznaczone
  isAllSelected() {
    // const numSelected = this.ingredients.filter(i=>i.isSelected).length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  // zaznacz/odznacz wszystkie wiersze
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach((row) => (row.isSelected = false));
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
      this.dataSource.data.forEach((row) => (row.isSelected = true));
    }
  }

  onToggle(index, status) {
    this.ingredients[index].isSelected = status;
  }

  onEditItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
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
        // this.shoppingListService.updateIngredient(i, el);
        // this.dataService.storeIngredients();
      });
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
        this.ingredients.push(result);
        this.dataSource = new MatTableDataSource(this.ingredients);
      });
  }

  deleteIngredient(el: Ingredient, i: number) {
    const title = 'Delete ' + el.name.toLowerCase();
    const message = 'Are you sure to delete ' + el.name.toLowerCase() + '?';
    const confirmButton = 'Delete';

    const dialogData = new ConfirmationDialogModel(
      title,
      message,
      confirmButton
    );
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(filter((result) => result))
      .subscribe((result) => {
        this.shoppingListService.setIngredients(this.ingredients);
        this.shoppingListService.deleteIngredient(i);
        this.dataService.storeIngredients();
      });
  }

  updateSelection() {
    this.initialSelection = this.ingredients.filter(
      (ingredient) => ingredient.isSelected
    );
    this.selection = new SelectionModel<Ingredient>(
      true,
      this.initialSelection
    );
  }

  onSave() {
    this.shoppingListService.setIngredients(this.ingredients);
    this.dataService.storeIngredients();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const ingredients = this.shoppingListService.getIngredients();

    if (!ingredients) {
      return true;
    }
    // console.log(JSON.stringify(ingredients));
    // console.log(JSON.stringify(JSON.stringify(this.ingredients)));
    // console.log(JSON.stringify(ingredients)===JSON.stringify(this.ingredients));

    // jesli nie ma zadnych zmian, zmien route
    if (JSON.stringify(ingredients) === JSON.stringify(this.ingredients)) {
      return true;
    }
    // zapisz zmiany i zmien route
    else {
      // console.log('Storing changes');
      this.onSave();
      return true;
    }
  }

  ngOnDestroy() {
    this.ingredientsChangeSub.unsubscribe();
  }


}
