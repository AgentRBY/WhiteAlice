import picoColors from 'picocolors';
import { sep } from 'path';
import { upFirstLetter } from './Common/Strings';

class Logger {
  public static error(error: Error): void {
    console.log(`${picoColors.red('➤')}  ${picoColors.bgRed(' Error ')} ${this.formatError(error)}`);
  }

  public static info(text: string): void {
    console.log(`${picoColors.blue('➤')}  ${picoColors.bgBlue(' Info ')} ${text}`);
  }

  public static success(text: string): void {
    console.log(`${picoColors.green('➤')}  ${picoColors.bgGreen(picoColors.black(' Success '))} ${text}`);
  }

  static formatError(error: Error): string {
    const errorMessage = this.formatErrorMessage(error.message);

    return `${upFirstLetter(error.name)}: ${upFirstLetter(errorMessage)} \n${this.parseStack(error.stack ?? '')
      .map(
        (line) =>
          picoColors.gray('➤  ') +
          line
            .replace(/^at +/, (m) => picoColors.gray(m))
            .replace(/\((.+)\)/, (_, m) => `(${picoColors.cyan(m)})`)
            .replace(/:(\d+):\d+/, (_, m) => picoColors.bold(` on line ${m}`)),
      )
      .join('\n')}`;
  }

  static formatErrorMessage(errorMessage: string): string {
    let newMessage = errorMessage.replace(/([!.?])$/, '');

    if (newMessage.includes('\n')) {
      newMessage = newMessage
        .split('\n')
        .map((line, index) => {
          if (index === 0) {
            return line;
          }

          return `${picoColors.red('➤ ')} ${line}`;
        })
        .join('\n');
    }

    return newMessage;
  }

  static parseStack(stack: string): string[] {
    const cwd = process.cwd() + sep;

    return stack
      .split('\n')
      .splice(1)
      .map((l) => l.trim().replace('file://', '').replace(cwd, ''));
  }
}

export default Logger;
