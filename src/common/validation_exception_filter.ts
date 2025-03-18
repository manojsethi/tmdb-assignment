import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorResponse {
  statusCode: number;
  message: string[];
  error: string;
}

interface FormattedError {
  field: string;
  error: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    const validationErrors = exception.getResponse() as ValidationErrorResponse;

    const formattedErrors: FormattedError[] = Array.isArray(
      validationErrors.message,
    )
      ? validationErrors.message.map((msg) => {
          const field = msg.split(' ')[0].toLowerCase();
          return { field, error: msg };
        })
      : [];

    response.status(status).json({
      status,
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
}
