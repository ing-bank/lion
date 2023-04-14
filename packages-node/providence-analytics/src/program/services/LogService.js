const pathLib = require('path');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

/**
 * @typedef {import('ora').Ora} Ora
 */

const { log } = console;

/**
 * @param {string} [title]
 * @returns {string}
 */
function printTitle(title) {
  return `${title ? `${title}\n` : ''}`;
}

/** @type {Ora} */
let spinner;

class LogService {
  /**
   * @param {string} text
   * @param {string} [title]
   */
  static debug(text, title) {
    if (this.allMuted || !this.debugEnabled) {
      return;
    }

    log(chalk.bgCyanBright.black.bold(`  debug${printTitle(title)}`), text);
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

    log(chalk.bgYellowBright.black.bold(`warning${printTitle(title)}`), text);
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

    log(chalk.bgRedBright.black.bold(` error${printTitle(title)}`), text);
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

    log(chalk.bgGreen.black.bold(`success${printTitle(title)}`), text);
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

    log(chalk.bgBlue.black.bold(`   info${printTitle(title)}`), text);
  }

  /**
   * @param {string} text
   */
  static spinnerStart(text) {
    spinner = ora(text).start();
  }

  /**
   * @param {string} text
   */
  static spinnerText(text) {
    if (!spinner) {
      this.spinnerStart(text);
    }
    spinner.text = text;
  }

  static spinnerStop() {
    spinner.stop();
  }

  static get spinner() {
    return spinner;
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

module.exports = { LogService };
