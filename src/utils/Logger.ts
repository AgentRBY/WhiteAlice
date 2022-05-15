import picocolors from 'picocolors';
import { sep } from 'path';
import { upFirstLetter } from './strings';

class Logger {
  public static error(error: Error): void {
    console.log(`${picocolors.red('➤')}  ${picocolors.bgRed(' Error ')} ${this.formatError(error)}`);
  }

  public static info(text: string): void {
    console.log(`${picocolors.blue('➤')}  ${picocolors.bgBlue(' Info ')} ${text}`);
  }

  public static success(text: string): void {
    console.log(`${picocolors.green('➤')}  ${picocolors.bgGreen(picocolors.black(' Success '))} ${text}`);
  }

  static formatError(error: Error): string {
    const errorMessage = error.message.replace(/([!.?])$/, ':');
    return `${upFirstLetter(errorMessage)} \n${this.parseStack(error.stack ?? '')
      .map((line) =>
        line
          .replace(/^at +/, (m) => picocolors.gray(`➤  ${m}`))
          .replace(/\((.+)\)/, (_, m) => `(${picocolors.cyan(m)})`)
          .replace(/:(\d+):\d+/, (_, m) => picocolors.bold(` on line ${m}`)),
      )
      .join('\n')}`;
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
