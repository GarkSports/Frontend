import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'defaultImage',
  standalone: true
})
export class DefaultImagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value !== null && value !== "" && value !== "null" ? value : `https://ui-avatars.com/api/?name=${args[0]}+${args[1]}&uppercase=true&color=${args[2] ?? 'ffffff'}&background=${args[3] ?? 'b7ef3f'}&rounded=${!args[4]}`
  }
}
