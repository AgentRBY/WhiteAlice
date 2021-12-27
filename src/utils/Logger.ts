import colors from 'colors';
import {sep} from 'path';
import {upFirstLetter} from './strings';

class Logger {
  public static error(error: Error): void {
    console.log(`${colors.red('➤')}  ${colors.bgRed(' Error ')} ${this.formatError(error)}`);
  }

  public static info(text: string): void {
    console.log(`${colors.blue('➤')}  ${colors.bgBlue(' Info ')} ${text}`);
  }

  public static success(text: string): void {
    console.log(`${colors.green('➤')}  ${colors.bgGreen.black(' Success ')} ${text}`);
  }

  static formatError(error: Error): string {
    const errorMessage = error.message.replace(/([!.?])$/, ':');
    return `${upFirstLetter(errorMessage)} \n${this.parseStack(error.stack ?? '')
      .map((line) =>
        line
          .replace(/^at +/, (m) => colors.gray(`➤  ${m}`))
          .replace(/\((.+)\)/, (_, m) => `(${colors.cyan(m)})`)
          .replace(/:(\d+):\d+/, (_, m) => colors.bold(` on line ${m}`)),
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
