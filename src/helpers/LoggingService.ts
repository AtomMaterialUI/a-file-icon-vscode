import { window, LogLevel } from 'vscode';

export class LoggingService {
  public logLevel: LogLevel = LogLevel.Info;
  private outputChannel = window.createOutputChannel('Atom Material Icons');

  /**
   * Logs a debug message
   * @param {string} message
   * @param data
   */
  public debug(message: string, data?: unknown) {
    if ([LogLevel.Off, LogLevel.Info, LogLevel.Warning, LogLevel.Error].includes(this.logLevel)) {
      return;
    }

    this.log(message, 'DEBUG');
    if (data) {
      this.logObject(data);
    }
  }

  /**
   * Logs an info message
   * @param {string} message
   * @param data
   */
  public info(message: string, data?: unknown) {
    if ([LogLevel.Off, LogLevel.Warning, LogLevel.Error].includes(this.logLevel)) {
      return;
    }

    this.log(message, 'INFO');
    if (data) {
      this.logObject(data);
    }
  }

  /**
   * Logs a warning
   * @param {string} message
   * @param data
   */
  public warn(message: string, data?: unknown) {
    if ([LogLevel.Off, LogLevel.Error].includes(this.logLevel)) {
      return;
    }

    this.log(message, 'WARN');
    if (data) {
      this.logObject(data);
    }
  }

  /**
   * Logs an error
   * @param {string} message
   * @param data
   */
  public error(message: string, data?: unknown) {
    if ([LogLevel.Off].includes(this.logLevel)) {
      return;
    }

    this.log(message, 'ERROR');
    if (data) {
      this.logObject(data);
    }
  }

  /**
   * Show the output channel
   */
  public show() {
    this.outputChannel.show();
  }

  private log(message: string, prefix: string): void {
    const title = new Date().toLocaleTimeString();
    this.outputChannel.appendLine(`["${prefix}" - ${title}] ${message}`);
  }

  private logObject(data: unknown): void {
    const message = JSON.stringify(data, null, 2);
    this.outputChannel.appendLine(message);
  }
}

export const logger = new LoggingService();