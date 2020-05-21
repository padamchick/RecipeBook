import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component';

import { AuthGuard } from '../auth/auth.guard';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipesResolverService } from './recipes-resolver.service';
import { RoleGuard } from './role.guard';

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    resolve: [RecipesResolverService],
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent, canActivate: [RoleGuard] },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService],
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        canActivate: [RoleGuard],
        resolve: [RecipesResolverService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
