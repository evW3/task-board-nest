import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class SchemaValidatePipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      //'The expected request body does not match the received one'
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}