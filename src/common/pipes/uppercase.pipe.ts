import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value !== 'string') {
      return value;
    }
    return value.toUpperCase();
  }
}
