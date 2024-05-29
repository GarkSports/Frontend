
import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {TablerIconsModule} from "angular-tabler-icons";

@Component({
  selector: 'app-branding',
  standalone: true,
  template: `
    <div class="branding">
      @if(options.theme === 'light') {
      <div class="row" >
<div class="col-2 pt-2">
<i-tabler name="arrow-left" class="d-flex"></i-tabler>
</div>
<div class="col  flex justify-center ml-8">
      <a href="/"  >
        <img
          src="./assets/images/logos/Gark_s Primary Logo - Vibrant Green .png"
          class="h-10 "
          alt="logo"
        />
      </a>
</div>
      </div>
      } @if(options.theme === 'dark') {

      <div class="flex justify-center">
      <a href="/">
        <img
          src="./assets/images/logos/logo-gark.png"
          class="align-middle m-2"
          alt="logo"
          width="150px"
        />
      </a>

      </div>
      }
    </div>
  `,
  imports: [
    TablerIconsModule
  ]
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
