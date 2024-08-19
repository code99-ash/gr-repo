import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class Validator implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any) {
    value = this.schema.parse(value);
    return value;
  }
}
