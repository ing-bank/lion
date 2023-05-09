import pathLib from 'path';
import fs from 'fs';

const { log } = console;

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  fgRed: '\x1b[31m',
  fgGreen: '\x1b[32m',
  fgYellow: '\x1b[33m',
  fgGray: '\x1b[90m',
  fgBlue: '\x1b[34m',
};

/**
 * @param {string} [title]
 * @returns {string}
 */
function printTitle(title) {
  return `${title ? `${title}\n` : ''}`;
}

export class LogService {
  /**
   * @param {string} text
   * @param {string} [title]
   */
  static debug(text, title) {
    if (this.allMuted || !this.debugEnabled) {
      return;
    }

    log(colors.bright, `  debug${printTitle(title)}`, colors.reset, text);
    // @ts-ignore
    this._logHistory.push(`-   debug -${printTitle(title)} ${text}`);
  }

  /**
   * @param {string} text
   * @param {string} [title]
   */
  static warn(text, title) {
    if (this.allMuted) {
      return;
    }

    log(colors.fgYellow, `warning${printTitle(title)}`, colors.reset, text);
    // @ts-ignore
    this._logHistory.push(`- warning -${printTitle(title)} ${text}`);
  }

  /**
   * @param {string} text
   * @param {string} [title]
   */
  static error(text, title) {
    // @ts-ignore
    this._logHistory.push(`-  error -${printTitle(title)} ${text}`);

    if (this.throwsOnError) {
      throw new Error(`${title ? `[${title}]: ` : ''}text`);
    }

    if (this.allMuted) {
      return;
    }

    log(colors.fgRed, `  error${printTitle(title)}`, colors.reset, text);
  }

  /**
   * @param {string} text
   * @param {string} [title]
   */
  static success(text, title) {
    // @ts-ignore
    this._logHistory.push(`- success -${printTitle(title)} ${text}`);
    if (this.allMuted) {
      return;
    }

    log(colors.fgGreen, `success${printTitle(title)}`, colors.reset, text);
  }

  /**
   * @param {string} text
   * @param {string} [title]
   */
  static info(text, title) {
    // @ts-ignore
    this._logHistory.push(`-    info -${printTitle(title)} ${text}`);
    if (this.allMuted) {
      return;
    }
    log(colors.fgBlue, `   info${printTitle(title)}`, colors.reset, text);
  }

  /**
   * @param {string} text
   * @param {number} minChars
   */
  static pad(text, minChars = 20) {
    let result = text;
    const padding = minChars - text.length;
    if (padding > 0) {
      result += ' '.repeat(padding);
    }
    return result;
  }

  static writeLogFile() {
    const filePath = pathLib.join(process.cwd(), 'providence.log');
    let file = `[log ${new Date()}]\n`;
    // @ts-ignore
    this._logHistory.forEach(l => {
      file += `${l}\n`;
    });
    file += `[/log ${new Date()}]\n\n`;
    fs.writeFileSync(filePath, file, { flag: 'a' });
    // @ts-ignore
    this._logHistory = [];
  }
}

LogService.debugEnabled = false;
LogService.allMuted = false;
LogService.throwsOnError = false;

/** @type {string[]} */
LogService._logHistory = [];
