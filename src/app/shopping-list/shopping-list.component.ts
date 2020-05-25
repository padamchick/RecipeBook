import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortable } from '@angular/material/sort';
import { DataStorageService } from '../shared/data-storage.service';
import { IngredientEditModel, IngredientEditComponent } from '../shared/ingredient-edit/ingredient-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent, ConfirmationDialogModel } from '../shared/confirmation-dialog/confirmation-dialog.component';

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
export class ShoppingListComponent implements OnInit, OnDestroy {

  // ingredients: ShoppingIngredient[];
  ingredients: Ingredient[];
  private ingredientsChangeSub: Subscription;
  initialSelection: Ingredient[] = [];

  // selection data table
  selection;
  displayedColumns: string[] = ['select', 'name', 'amount', 'unit', 'action'];
  dataSource: MatTableDataSource<Ingredient>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public shoppingListService: ShoppingListService,
    private dataService: DataStorageService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.ingredients = this.shoppingListService.getIngredients() ;
    this.ingredients = JSON.parse(JSON.stringify(this.shoppingListService.getIngredients())) ;

    // uzupelnij selected = false dla skladnikow bez ustawionego parametru
    this.ingredients.filter(ingredient => !ingredient.isSelected)
    .forEach(ing => ing.isSelected=false);

    // filtrujemy skladniki z selected = true
    this.initialSelection = this.ingredients.filter(ingredient => ingredient.isSelected);
    this.selection = new SelectionModel<Ingredient>(true, this.initialSelection);

    // uaktualniaj po kazdej zmianie w skladnikach
    this.ingredientsChangeSub = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        // this.ingredients = ingredients;
        this.ingredients = JSON.parse(JSON.stringify(ingredients));
        this.dataSource = new MatTableDataSource(this.ingredients);
      }
    );
    this.onSort()

  }

  onSort() {
    this.dataSource = new MatTableDataSource(this.ingredients);
    // this.sort.sort(({ id: 'select', start: 'asc'}) as MatSortable);
    // this.dataSource.sort = this.sort;

    // zmiana sortowania dotyczy tylko tego, o którym mowa w sortingDataAccessor
    // this.dataSource.sortingDataAccessor = (ingredient, sortHeaderId) => {
    //   switch (sortHeaderId) {
    //     case 'select': return this.selection.isSelected(ingredient);
    //     default: return ingredient[sortHeaderId];
    //   }
    // };
  }

  // sprawdza, czy wszystkie wiersze są zaznaczone
  isAllSelected() {
    // const numSelected = this.ingredients.filter(i=>i.isSelected).length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  // zaznacz/odznacz wszystkie wiersze
  masterToggle() {
    if(this.isAllSelected()) {
      this.selection.clear();
      this.dataSource.data.forEach((row) => row.isSelected = false)
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
      this.dataSource.data.forEach((row) => row.isSelected = true);
    }

  }

  onToggle(index, status) {
    this.ingredients[index].isSelected = status;
  }


  onEditItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
  }

  onLog(message) {
    console.log(message);
  }

  onEdit(el: Ingredient, i: number) {
    const title = 'Edit Ingredient';

    const dialogData = new IngredientEditModel(title, el.name, el.amount, el.unit);
    const dialogRef = this.dialog.open(IngredientEditComponent, {
      maxWidth: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().pipe(filter((result: Ingredient) => !!result)).subscribe(
      result => {
        el.name = result.name;
        el.amount = result.amount;
        el.unit = result.unit;
        // this.shoppingListService.updateIngredient(i, el);
        // this.dataService.storeIngredients();
      }
    );
  }

  onDelete(el: Ingredient, i: number) {
    const title = 'Delete '+el.name.toLowerCase();
    const message = 'Are you sure to delete '+el.name.toLowerCase()+'?';
    const confirmButton = 'Delete';

    const dialogData = new ConfirmationDialogModel(title, message, confirmButton);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: dialogData
    })

    dialogRef.afterClosed()
    .pipe(filter(result=>result))
    .subscribe(result => {
      this.shoppingListService.deleteIngredient(i);
      this.dataService.storeIngredients();
    })
  }

  onSave() {
    // console.log('save');
    this.dataService.storeIngredients();
  }



  ngOnDestroy() {
    this.ingredientsChangeSub.unsubscribe();
  }
}
