import {
  Component,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { AppSettings } from 'src/app/app.config';
import { CoreService } from 'src/app/services/core.service';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-customizer',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule, FormsModule, NgScrollbarModule],
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomizerComponent {
   
  @Output() optionsChange = new EventEmitter<AppSettings>();
  constructor(private settings: CoreService) {}
  options = this.settings.getOptions();

  ngOnInit() {
    // Set boxed to false (full) by default
    //this.options.theme = 'dark';
    //this.options.boxed = false;
    this.optionsChange.emit(this.options);
  }

  setDark() {
    this.optionsChange.emit(this.options);
  }

  setColor() {
    this.optionsChange.emit(this.options);
  }

  setDir() {
    this.optionsChange.emit(this.options);
  }

  setSidebar() {
    this.optionsChange.emit(this.options);
  }
}
