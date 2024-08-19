import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';

interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch(Error, HttpException) // catch any error
export class ResponseFilter<T extends HttpException | Error>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatusCode.InternalServerError;
    let message = 'Something went wrong';
    let error;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as HttpExceptionResponse;
      statusCode = errorResponse.statusCode;
      error = errorResponse.error;
      message = errorResponse.message;

      // try to parse the error into an object if possible (typically zod validation messages)
      try {
        error = JSON.parse(error);
      } catch (_) {
        error = error;
      }
    }

    Logger.error(exception.stack);

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
