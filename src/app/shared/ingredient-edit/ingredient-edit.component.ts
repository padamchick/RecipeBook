import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ingredient } from '../ingredient.model';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent {
  title: string;
  name: string;
  amount: number;
  unit: string;

  constructor(public dialogRef: MatDialogRef<IngredientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IngredientEditModel) {
      this.title = data.title;
      this.name = data.name;
      this.amount = data.amount;
      this.unit = data.unit;
    }

    onSave() {
      this.dialogRef.close(new Ingredient(this.name, this.amount, this.unit));
    }

    onCancel() {
      this.dialogRef.close(false);
    }

}

export class IngredientEditModel {
  constructor(public title: string, public name: string, public amount: number, public unit: string) {}
}
