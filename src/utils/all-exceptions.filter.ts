import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerService } from '../modules/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AllExceptionsFilter.name);
  }

  //eslint-disable-next-line
  catch(exception: HttpException | unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const isHttpException = exception instanceof HttpException;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (isHttpException) {
      httpStatus = exception.getStatus();
    }

    const error = isHttpException
      ? exception?.getResponse()
      : (exception as Error)?.message ||
        'An unexpected error occurred, please try again later or contact support.';

    const exceptionData = {
      statusCode: httpStatus,
      error,
      timestamp: new Date().toISOString(),
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    let exceptionStr = exception;

    try {
      exceptionStr = JSON.stringify(exception);
    } catch (ex) {
      this.logger.log('exception stringified error:', ex);
    }

    this.logger.error(
      `Exception caught in global filter. respBody: ${JSON.stringify(
        exceptionData,
      )}. exception: ${JSON.stringify(exceptionStr)}}`,
    );

    httpAdapter.reply(ctx.getResponse(), error, httpStatus);
  }
}
