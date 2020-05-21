import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    LayoutModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    LayoutModule
  ]
})
export class SharedModule {}
