import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  }
}
