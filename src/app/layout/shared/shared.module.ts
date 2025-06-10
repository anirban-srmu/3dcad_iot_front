// Angular Import
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardComponent } from './components/card/card.component';



// third party
import { NgScrollbarModule } from 'ngx-scrollbar';
import 'hammerjs';
import 'mousetrap';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafePipe } from 'src/app/safe.pipe';
 //import { SafePipe } from 'src/app/safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
   
    NgScrollbarModule

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgScrollbarModule
  ],
  declarations: [ ]
})
export class SharedModule {
  
}
