import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatProgressBarModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IndianCurrencyPipe } from './pipes/indian-currency.pipe';
import { MatTooltipModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [IndianCurrencyPipe],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatMenuModule,
    MatRadioModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    IndianCurrencyPipe,
    MatGridListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatMenuModule,
    MatRadioModule
  ],
  // providers: [MatDatepickerModule, IndianCurrencyPipe],
})
export class MaterialModulesModule { }
