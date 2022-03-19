import { ResponseErrors } from './errors.enum';

export interface ErrorResponse {
  code: ResponseErrors;
  message: string;
}
