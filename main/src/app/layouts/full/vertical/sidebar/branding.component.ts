import {Component, Input} from '@angular/core';
import {CoreService} from 'src/app/services/core.service';
import {TablerIconsModule} from "angular-tabler-icons";
import {Academie} from "../../../../../models/academie.model";
import {AcademieService} from "../../../../services/academie.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-branding',
  standalone: true,
  template: `
    <div class="branding mb-4">
      @if (options.theme === 'light') {
        <div class="row flex flex-nowrap">
          <div class="col-2 pt-2">
            <button (click)="goBack()" class="pt-2">
              <i-tabler name="arrow-left" class="d-flex"></i-tabler>
            </button>
          </div>
          <div class="col flex justify-center items-center hidden sm:flex">
            <div>
              <img
                src="{{academie !== null && academie.logo != null ? academie?.logo : 'assets/images/brand/GARKSPORTS.png'}}"
                class="h-14"
                alt="logo"
              />
            </div>
          </div>
        </div>

      }
      @if (options.theme === 'dark') {

        <div class="flex justify-center">
          <div>
            <img
              src="{{academie !==null && academie.logo!=null ? academie?.logo : 'assets/images/brand/GARKSPORTS.png'}}"
              width="300"
              alt="logo"
            />

          </div>

        </div>
      }
    </div>
  `,
  imports: [
    TablerIconsModule
  ]
})
export class BrandingComponent {
  academie: Academie | null = null;
  options = this.settings.getOptions();

  @Input() mobileNav = false;

  constructor(private academieService: AcademieService, private settings: CoreService, private location: Location) {
    this.academieService.getAcademie().subscribe((data) => {
      this.academie = data;
      console.log(this.academie);
    });
  }

  goBack() {
    this.location.back();
  }
}
