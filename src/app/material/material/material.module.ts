import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';

const materialComponents = [
  MatCardModule,
  MatToolbarModule,
  MatListModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  MatDividerModule,
  MatTableModule,
  MatInputModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatDialogModule,
  MatCheckboxModule,
  MatSortModule,
  MatTooltipModule
]

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})
export class MaterialModule { }
