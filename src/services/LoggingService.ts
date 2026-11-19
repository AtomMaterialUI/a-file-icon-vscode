import { performance } from 'node:perf_hooks';
import { setFlagsFromString } from 'node:v8';
import { runInNewContext } from 'node:vm';
import { window, LogLevel } from 'vscode';

const mb = (bytes: number) => (bytes / 1_048_576).toFixed(1);

export class LoggingService {
  public logLevel: LogLevel = LogLevel.Info;
  private outputChannel = window.createOutputChannel('Cool Theme Kit');

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
   * Logs the memory of the extension host (after a garbage collection, so what is kept) and the time since `since`.
   * Only when the environment variable COOL_THEME_KIT_MEMORY is set: it is how the cost of the extension is measured,
   * nothing is logged or collected for the users.
   * @param {string} label
   * @param {number} since a `performance.now()` of the start of what is measured
   */
  public memory(label: string, since?: number) {
    if (!process.env.COOL_THEME_KIT_MEMORY) return;
    try {
      setFlagsFromString('--expose-gc');
      (runInNewContext('gc') as () => void)();
    } catch {
      // without a collection the numbers include garbage
    }
    const { heapUsed, rss } = process.memoryUsage();
    const time = since === undefined ? '' : ` time=${(performance.now() - since).toFixed(0)}ms`;
    this.log(`${label}: heapUsed=${mb(heapUsed)}MB rss=${mb(rss)}MB${time}`, 'MEMORY');
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