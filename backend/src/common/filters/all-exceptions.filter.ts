import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { Error as MongooseError, mongo } from 'mongoose';

/**
 * Converts every error into a consistent JSON shape and never leaks stack
 * traces or internal messages for unexpected errors.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, message } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status] ?? 'Error',
      message,
    });
  }

  private resolve(exception: unknown): {
    status: number;
    message: string | string[];
  } {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const message =
        typeof body === 'object' && body && 'message' in body
          ? (body as { message: string | string[] }).message
          : exception.message;
      return { status: exception.getStatus(), message };
    }
    if (exception instanceof MongooseError.ValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: Object.values(exception.errors).map((e) => e.message),
      };
    }
    if (exception instanceof MongooseError.CastError) {
      return { status: HttpStatus.BAD_REQUEST, message: 'Invalid value' };
    }
    if (exception instanceof mongo.MongoServerError && exception.code === 11000) {
      return { status: HttpStatus.CONFLICT, message: 'Duplicate value' };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    };
  }
}
