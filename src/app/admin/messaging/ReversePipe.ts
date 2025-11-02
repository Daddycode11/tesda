import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reversePipe',
  pure: true,
  standalone: true,
})
export class ReversePipe implements PipeTransform {
  transform<T>(value: T[]): T[] {
    return Array.isArray(value) ? [...value].reverse() : value;
  }
}
