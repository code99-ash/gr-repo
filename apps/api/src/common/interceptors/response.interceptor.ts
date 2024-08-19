import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response as ServerResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const serverResponse = context.switchToHttp().getResponse<ServerResponse>();

    return next.handle().pipe(
      map((data) => ({
        data,
        message: 'Success',
        statusCode: serverResponse.statusCode,
      })),
    );
  }
}
