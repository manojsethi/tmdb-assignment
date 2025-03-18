import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';
import Rollbar from 'rollbar';
import isLocalEnv from '../../utils/is_local_env';
import { envConfig } from '../../config/env_configuration';

@Injectable({ scope: Scope.TRANSIENT })
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class LoggerService extends ConsoleLogger {
  rollbar = new Rollbar({
    accessToken: envConfig.ROLLBAR_KEY,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      code_version: '1.0.0',
    },
  });

  private isLocalEnv = isLocalEnv();

  formatMessage(message: string, level: LogLevel): string {
    // Determine colorization based on the environment
    const colorize = this.isLocalEnv;
    const timestamp = new Date().toISOString();
    const formattedContext = this.context ? ` [${this.context}]` : '';
    const levelString = colorize
      ? this.colorize(level, level)
      : level.toUpperCase();
    return `[${levelString}] ${timestamp}${formattedContext} - ${message}`;
  }

  private logMessage(
    method: 'log' | 'warn' | 'error' | 'debug',
    message: any,
    ...optionalParams: any[]
  ) {
    // Format message with colorization based on the environment
    const formattedMessage = this.formatMessage(message, method);

    // Log to console
    console[method](formattedMessage, ...optionalParams);

    // If not in a local environment, log to Rollbar without colorization
    if (!this.isLocalEnv && method !== 'debug') {
      this.rollbar[method](message, ...optionalParams);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    this.logMessage('log', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logMessage('error', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logMessage('warn', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logMessage('debug', message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logMessage('debug', message, ...optionalParams);
  }
}
