import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ZodError } from 'zod';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // clean validation error response
        if (error instanceof ZodError) {
          const statusCode = HttpStatusCode.BadRequest;
          const stack = error.message;
          const message = 'Validation Error';

          return throwError(
            () =>
              new HttpException(
                {
                  message,
                  statusCode,
                  stack: error,
                  error: stack,
                },
                statusCode,
              ),
          );
        }
        return throwError(
          () => new InternalServerErrorException(undefined, error.message),
        );
      }),
    );
  }
}
