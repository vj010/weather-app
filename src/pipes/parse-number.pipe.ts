import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ResponseErrors } from 'src/types/errors.enum';

@Injectable()
export class ParseNumber implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number {
    if (value === undefined || value === null) {
      throw new HttpException(
        {
          code: ResponseErrors.BAD_REQUEST,
          message: 'lat/lng required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const number = +value;
    if (isNaN(number)) {
      throw new HttpException(
        {
          code: ResponseErrors.BAD_REQUEST,
          message: 'lat/lng must be valid numbers',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return number;
  }
}
