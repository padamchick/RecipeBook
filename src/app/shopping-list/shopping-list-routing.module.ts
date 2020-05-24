import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { TableComponent } from './table/table.component';
import { ShoppingResolverService } from './shopping-resolver.service';

const routes: Routes = [
  { path: '', component: ShoppingListComponent, resolve: [ShoppingResolverService] }
  // { path: '', component: TableComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule { }
