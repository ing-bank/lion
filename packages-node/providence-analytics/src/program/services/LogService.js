const pathLib = require('path');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

const { log } = console;

function printTitle(title) {
  return `${title ? `${title}\n` : ''}`;
}

let spinner;
class LogService {
  static debug(text, title) {
    if (!this.debugEnabled) return;
    log(chalk.bgCyanBright.black.bold(`  debug${printTitle(title)}`), text);
    this._logHistory.push(`-   debug -${printTitle(title)} ${text}`);
  }

  static warn(text, title) {
    log(chalk.bgYellowBright.black.bold(`warning${printTitle(title)}`), text);
    this._logHistory.push(`- warning -${printTitle(title)} ${text}`);
  }

  static error(text, title) {
    log(chalk.bgRedBright.black.bold(` error${printTitle(title)}`), text);
    this._logHistory.push(`-  error -${printTitle(title)} ${text}`);
  }

  static success(text, title) {
    log(chalk.bgGreen.black.bold(`success${printTitle(title)}`), text);
    this._logHistory.push(`- success -${printTitle(title)} ${text}`);
  }

  static info(text, title) {
    log(chalk.bgBlue.black.bold(`   info${printTitle(title)}`), text);
    this._logHistory.push(`-    info -${printTitle(title)} ${text}`);
  }

  static spinnerStart(text) {
    spinner = ora(text).start();
  }

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

  static pad(str, minChars = 20) {
    let result = str;
    const padding = minChars - str.length;
    if (padding > 0) {
      result += ' '.repeat(padding);
    }
    return result;
  }

  static writeLogFile() {
    const filePath = pathLib.join(process.cwd(), 'providence.log');
    let file = `[log ${new Date()}]\n`;
    this._logHistory.forEach(l => {
      file += `${l}\n`;
    });
    file += `[/log ${new Date()}]\n\n`;
    fs.writeFileSync(filePath, file, { flag: 'a' });
    this._logHistory = [];
  }
}
LogService.debugEnabled = false;
LogService._logHistory = [];

module.exports = { LogService };
