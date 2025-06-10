import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../theme/shared/shared.module';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {

}
