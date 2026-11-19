function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// @flow
var LONG = 'long';
var SHORT = 'short';
var NARROW = 'narrow';
var NUMERIC = 'numeric';
var TWODIGIT = '2-digit';

/**
 * formatting information
 **/
var formatMessageFormats = {
  number: {
    decimal: {
      style: 'decimal'
    },
    integer: {
      style: 'decimal',
      maximumFractionDigits: 0
    },
    currency: {
      style: 'currency',
      currency: 'USD'
    },
    percent: {
      style: 'percent'
    },
    default: {
      style: 'decimal'
    }
  },
  date: {
    short: {
      month: NUMERIC,
      day: NUMERIC,
      year: TWODIGIT
    },
    medium: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    },
    long: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC
    },
    full: {
      month: LONG,
      day: NUMERIC,
      year: NUMERIC,
      weekday: LONG
    },
    default: {
      month: SHORT,
      day: NUMERIC,
      year: NUMERIC
    }
  },
  time: {
    short: {
      hour: NUMERIC,
      minute: NUMERIC
    },
    medium: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    },
    long: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    full: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC,
      timeZoneName: SHORT
    },
    default: {
      hour: NUMERIC,
      minute: NUMERIC,
      second: NUMERIC
    }
  },
  duration: {
    default: {
      hours: {
        minimumIntegerDigits: 1,
        maximumFractionDigits: 0
      },
      minutes: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
      },
      seconds: {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 3
      }
    }
  },
  parseNumberPattern: function (pattern/*: ?string */) {
    if (!pattern) return
    var options = {};
    var currency = pattern.match(/\b[A-Z]{3}\b/i);
    var syms = pattern.replace(/[^¤]/g, '').length;
    if (!syms && currency) syms = 1;
    if (syms) {
      options.style = 'currency';
      options.currencyDisplay = syms === 1 ? 'symbol' : syms === 2 ? 'code' : 'name';
      options.currency = currency ? currency[0].toUpperCase() : 'USD';
    } else if (pattern.indexOf('%') >= 0) {
      options.style = 'percent';
    }
    if (!/[@#0]/.test(pattern)) return options.style ? options : undefined
    options.useGrouping = pattern.indexOf(',') >= 0;
    if (/E\+?[@#0]+/i.test(pattern) || pattern.indexOf('@') >= 0) {
      var size = pattern.replace(/E\+?[@#0]+|[^@#0]/gi, '');
      options.minimumSignificantDigits = Math.min(Math.max(size.replace(/[^@0]/g, '').length, 1), 21);
      options.maximumSignificantDigits = Math.min(Math.max(size.length, 1), 21);
    } else {
      var parts = pattern.replace(/[^#0.]/g, '').split('.');
      var integer = parts[0];
      var n = integer.length - 1;
      while (integer[n] === '0') --n;
      options.minimumIntegerDigits = Math.min(Math.max(integer.length - 1 - n, 1), 21);
      var fraction = parts[1] || '';
      n = 0;
      while (fraction[n] === '0') ++n;
      options.minimumFractionDigits = Math.min(Math.max(n, 0), 20);
      while (fraction[n] === '#') ++n;
      options.maximumFractionDigits = Math.min(Math.max(n, 0), 20);
    }
    return options
  },
  parseDatePattern: function (pattern/*: ?string */) {
    if (!pattern) return
    var options = {};
    for (var i = 0; i < pattern.length;) {
      var current = pattern[i];
      var n = 1;
      while (pattern[++i] === current) ++n;
      switch (current) {
        case 'G':
          options.era = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break
        case 'y':
        case 'Y':
          options.year = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 'M':
        case 'L':
          n = Math.min(Math.max(n - 1, 0), 4);
          options.month = [NUMERIC, TWODIGIT, SHORT, LONG, NARROW][n];
          break
        case 'E':
        case 'e':
        case 'c':
          options.weekday = n === 5 ? NARROW : n === 4 ? LONG : SHORT;
          break
        case 'd':
        case 'D':
          options.day = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 'h':
        case 'K':
          options.hour12 = true;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 'H':
        case 'k':
          options.hour12 = false;
          options.hour = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 'm':
          options.minute = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 's':
        case 'S':
          options.second = n === 2 ? TWODIGIT : NUMERIC;
          break
        case 'z':
        case 'Z':
        case 'v':
        case 'V':
          options.timeZoneName = n === 1 ? SHORT : LONG;
          break
      }
    }
    return Object.keys(options).length ? options : undefined
  }
};

// @flow
// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
var lookupClosestLocale = function lookupClosestLocale (locale/*: string | string[] | void */, available/*: { [string]: any } */)/*: ?string */ {
  if (typeof locale === 'string' && available[locale]) return locale
  var locales = [].concat(locale || []);
  for (var l = 0, ll = locales.length; l < ll; ++l) {
    var current = locales[l].split('-');
    while (current.length) {
      var candidate = current.join('-');
      if (available[candidate]) return candidate
      current.pop();
    }
  }
};

// @flow

/*:: export type Rule = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other' */
var zero = 'zero', one = 'one', two = 'two', few = 'few', many = 'many', other = 'other';
var f = [
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return 0 <= n && n <= 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var n = +s;
    return i === 0 || n === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 0 ? zero
      : n === 1 ? one
      : n === 2 ? two
      : 3 <= n % 100 && n % 100 <= 10 ? few
      : 11 <= n % 100 && n % 100 <= 99 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return i === 1 && v === 0 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n % 10 === 1 && n % 100 !== 11 ? one
      : (2 <= n % 10 && n % 10 <= 4) && (n % 100 < 12 || 14 < n % 100) ? few
      : n % 10 === 0 || (5 <= n % 10 && n % 10 <= 9) || (11 <= n % 100 && n % 100 <= 14) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n % 10 === 1 && (n % 100 !== 11 && n % 100 !== 71 && n % 100 !== 91) ? one
      : n % 10 === 2 && (n % 100 !== 12 && n % 100 !== 72 && n % 100 !== 92) ? two
      : ((3 <= n % 10 && n % 10 <= 4) || n % 10 === 9) && ((n % 100 < 10 || 19 < n % 100) && (n % 100 < 70 || 79 < n % 100) && (n % 100 < 90 || 99 < n % 100)) ? few
      : n !== 0 && n % 1000000 === 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var f = +(s + '.').split('.')[1];
    return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one
      : v === 0 && (2 <= i % 10 && i % 10 <= 4) && (i % 100 < 12 || 14 < i % 100) || (2 <= f % 10 && f % 10 <= 4) && (f % 100 < 12 || 14 < f % 100) ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return i === 1 && v === 0 ? one
      : (2 <= i && i <= 4) && v === 0 ? few
      : v !== 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 0 ? zero
      : n === 1 ? one
      : n === 2 ? two
      : n === 3 ? few
      : n === 6 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
    var n = +s;
    return n === 1 || t !== 0 && (i === 0 || i === 1) ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var f = +(s + '.').split('.')[1];
    return v === 0 && i % 100 === 1 || f % 100 === 1 ? one
      : v === 0 && i % 100 === 2 || f % 100 === 2 ? two
      : v === 0 && (3 <= i % 100 && i % 100 <= 4) || (3 <= f % 100 && f % 100 <= 4) ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    return i === 0 || i === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var f = +(s + '.').split('.')[1];
    return v === 0 && (i === 1 || i === 2 || i === 3) || v === 0 && (i % 10 !== 4 && i % 10 !== 6 && i % 10 !== 9) || v !== 0 && (f % 10 !== 4 && f % 10 !== 6 && f % 10 !== 9) ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n === 2 ? two
      : 3 <= n && n <= 6 ? few
      : 7 <= n && n <= 10 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 || n === 11 ? one
      : n === 2 || n === 12 ? two
      : ((3 <= n && n <= 10) || (13 <= n && n <= 19)) ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return v === 0 && i % 10 === 1 ? one
      : v === 0 && i % 10 === 2 ? two
      : v === 0 && (i % 100 === 0 || i % 100 === 20 || i % 100 === 40 || i % 100 === 60 || i % 100 === 80) ? few
      : v !== 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var n = +s;
    return i === 1 && v === 0 ? one
      : i === 2 && v === 0 ? two
      : v === 0 && (n < 0 || 10 < n) && n % 10 === 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var t = +('' + s).replace(/^[^.]*.?|0+$/g, '');
    return t === 0 && i % 10 === 1 && i % 100 !== 11 || t !== 0 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n === 2 ? two
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 0 ? zero
      : n === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var n = +s;
    return n === 0 ? zero
      : (i === 0 || i === 1) && n !== 0 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var f = +(s + '.').split('.')[1];
    var n = +s;
    return n % 10 === 1 && (n % 100 < 11 || 19 < n % 100) ? one
      : (2 <= n % 10 && n % 10 <= 9) && (n % 100 < 11 || 19 < n % 100) ? few
      : f !== 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var v = (s + '.').split('.')[1].length;
    var f = +(s + '.').split('.')[1];
    var n = +s;
    return n % 10 === 0 || (11 <= n % 100 && n % 100 <= 19) || v === 2 && (11 <= f % 100 && f % 100 <= 19) ? zero
      : n % 10 === 1 && n % 100 !== 11 || v === 2 && f % 10 === 1 && f % 100 !== 11 || v !== 2 && f % 10 === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var f = +(s + '.').split('.')[1];
    return v === 0 && i % 10 === 1 && i % 100 !== 11 || f % 10 === 1 && f % 100 !== 11 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    var n = +s;
    return i === 1 && v === 0 ? one
      : v !== 0 || n === 0 || n !== 1 && (1 <= n % 100 && n % 100 <= 19) ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n === 0 || (2 <= n % 100 && n % 100 <= 10) ? few
      : 11 <= n % 100 && n % 100 <= 19 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return i === 1 && v === 0 ? one
      : v === 0 && (2 <= i % 10 && i % 10 <= 4) && (i % 100 < 12 || 14 < i % 100) ? few
      : v === 0 && i !== 1 && (0 <= i % 10 && i % 10 <= 1) || v === 0 && (5 <= i % 10 && i % 10 <= 9) || v === 0 && (12 <= i % 100 && i % 100 <= 14) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    return 0 <= i && i <= 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return v === 0 && i % 10 === 1 && i % 100 !== 11 ? one
      : v === 0 && (2 <= i % 10 && i % 10 <= 4) && (i % 100 < 12 || 14 < i % 100) ? few
      : v === 0 && i % 10 === 0 || v === 0 && (5 <= i % 10 && i % 10 <= 9) || v === 0 && (11 <= i % 100 && i % 100 <= 14) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var n = +s;
    return i === 0 || n === 1 ? one
      : 2 <= n && n <= 10 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var f = +(s + '.').split('.')[1];
    var n = +s;
    return (n === 0 || n === 1) || i === 0 && f === 1 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    var v = (s + '.').split('.')[1].length;
    return v === 0 && i % 100 === 1 ? one
      : v === 0 && i % 100 === 2 ? two
      : v === 0 && (3 <= i % 100 && i % 100 <= 4) || v !== 0 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return (0 <= n && n <= 1) || (11 <= n && n <= 99) ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 || n === 5 || n === 7 || n === 8 || n === 9 || n === 10 ? one
      : n === 2 || n === 3 ? two
      : n === 4 ? few
      : n === 6 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    return (i % 10 === 1 || i % 10 === 2 || i % 10 === 5 || i % 10 === 7 || i % 10 === 8) || (i % 100 === 20 || i % 100 === 50 || i % 100 === 70 || i % 100 === 80) ? one
      : (i % 10 === 3 || i % 10 === 4) || (i % 1000 === 100 || i % 1000 === 200 || i % 1000 === 300 || i % 1000 === 400 || i % 1000 === 500 || i % 1000 === 600 || i % 1000 === 700 || i % 1000 === 800 || i % 1000 === 900) ? few
      : i === 0 || i % 10 === 6 || (i % 100 === 40 || i % 100 === 60 || i % 100 === 90) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return (n % 10 === 2 || n % 10 === 3) && (n % 100 !== 12 && n % 100 !== 13) ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 || n === 3 ? one
      : n === 2 ? two
      : n === 4 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 0 || n === 7 || n === 8 || n === 9 ? zero
      : n === 1 ? one
      : n === 2 ? two
      : n === 3 || n === 4 ? few
      : n === 5 || n === 6 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n % 10 === 1 && n % 100 !== 11 ? one
      : n % 10 === 2 && n % 100 !== 12 ? two
      : n % 10 === 3 && n % 100 !== 13 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 || n === 11 ? one
      : n === 2 || n === 12 ? two
      : n === 3 || n === 13 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n === 2 || n === 3 ? two
      : n === 4 ? few
      : n === 6 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 || n === 5 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 11 || n === 8 || n === 80 || n === 800 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    return i === 1 ? one
      : i === 0 || ((2 <= i % 100 && i % 100 <= 20) || i % 100 === 40 || i % 100 === 60 || i % 100 === 80) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n % 10 === 6 || n % 10 === 9 || n % 10 === 0 && n !== 0 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var i = Math.floor(Math.abs(+s));
    return i % 10 === 1 && i % 100 !== 11 ? one
      : i % 10 === 2 && i % 100 !== 12 ? two
      : (i % 10 === 7 || i % 10 === 8) && (i % 100 !== 17 && i % 100 !== 18) ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n === 2 || n === 3 ? two
      : n === 4 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return 1 <= n && n <= 4 ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return (n === 1 || n === 5 || (7 <= n && n <= 9)) ? one
      : n === 2 || n === 3 ? two
      : n === 4 ? few
      : n === 6 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n === 1 ? one
      : n % 10 === 4 && n % 100 !== 14 ? many
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return (n % 10 === 1 || n % 10 === 2) && (n % 100 !== 11 && n % 100 !== 12) ? one
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return (n % 10 === 6 || n % 10 === 9) || n === 10 ? few
      : other
  },
  function (s/*: string | number */)/*: Rule */ {
    var n = +s;
    return n % 10 === 3 && n % 100 !== 13 ? few
      : other
  }
];

var plurals = {
  af: { cardinal: f[0] },
  ak: { cardinal: f[1] },
  am: { cardinal: f[2] },
  ar: { cardinal: f[3] },
  ars: { cardinal: f[3] },
  as: { cardinal: f[2], ordinal: f[34] },
  asa: { cardinal: f[0] },
  ast: { cardinal: f[4] },
  az: { cardinal: f[0], ordinal: f[35] },
  be: { cardinal: f[5], ordinal: f[36] },
  bem: { cardinal: f[0] },
  bez: { cardinal: f[0] },
  bg: { cardinal: f[0] },
  bh: { cardinal: f[1] },
  bn: { cardinal: f[2], ordinal: f[34] },
  br: { cardinal: f[6] },
  brx: { cardinal: f[0] },
  bs: { cardinal: f[7] },
  ca: { cardinal: f[4], ordinal: f[37] },
  ce: { cardinal: f[0] },
  cgg: { cardinal: f[0] },
  chr: { cardinal: f[0] },
  ckb: { cardinal: f[0] },
  cs: { cardinal: f[8] },
  cy: { cardinal: f[9], ordinal: f[38] },
  da: { cardinal: f[10] },
  de: { cardinal: f[4] },
  dsb: { cardinal: f[11] },
  dv: { cardinal: f[0] },
  ee: { cardinal: f[0] },
  el: { cardinal: f[0] },
  en: { cardinal: f[4], ordinal: f[39] },
  eo: { cardinal: f[0] },
  es: { cardinal: f[0] },
  et: { cardinal: f[4] },
  eu: { cardinal: f[0] },
  fa: { cardinal: f[2] },
  ff: { cardinal: f[12] },
  fi: { cardinal: f[4] },
  fil: { cardinal: f[13], ordinal: f[0] },
  fo: { cardinal: f[0] },
  fr: { cardinal: f[12], ordinal: f[0] },
  fur: { cardinal: f[0] },
  fy: { cardinal: f[4] },
  ga: { cardinal: f[14], ordinal: f[0] },
  gd: { cardinal: f[15], ordinal: f[40] },
  gl: { cardinal: f[4] },
  gsw: { cardinal: f[0] },
  gu: { cardinal: f[2], ordinal: f[41] },
  guw: { cardinal: f[1] },
  gv: { cardinal: f[16] },
  ha: { cardinal: f[0] },
  haw: { cardinal: f[0] },
  he: { cardinal: f[17] },
  hi: { cardinal: f[2], ordinal: f[41] },
  hr: { cardinal: f[7] },
  hsb: { cardinal: f[11] },
  hu: { cardinal: f[0], ordinal: f[42] },
  hy: { cardinal: f[12], ordinal: f[0] },
  ia: { cardinal: f[4] },
  io: { cardinal: f[4] },
  is: { cardinal: f[18] },
  it: { cardinal: f[4], ordinal: f[43] },
  iu: { cardinal: f[19] },
  iw: { cardinal: f[17] },
  jgo: { cardinal: f[0] },
  ji: { cardinal: f[4] },
  jmc: { cardinal: f[0] },
  ka: { cardinal: f[0], ordinal: f[44] },
  kab: { cardinal: f[12] },
  kaj: { cardinal: f[0] },
  kcg: { cardinal: f[0] },
  kk: { cardinal: f[0], ordinal: f[45] },
  kkj: { cardinal: f[0] },
  kl: { cardinal: f[0] },
  kn: { cardinal: f[2] },
  ks: { cardinal: f[0] },
  ksb: { cardinal: f[0] },
  ksh: { cardinal: f[20] },
  ku: { cardinal: f[0] },
  kw: { cardinal: f[19] },
  ky: { cardinal: f[0] },
  lag: { cardinal: f[21] },
  lb: { cardinal: f[0] },
  lg: { cardinal: f[0] },
  ln: { cardinal: f[1] },
  lt: { cardinal: f[22] },
  lv: { cardinal: f[23] },
  mas: { cardinal: f[0] },
  mg: { cardinal: f[1] },
  mgo: { cardinal: f[0] },
  mk: { cardinal: f[24], ordinal: f[46] },
  ml: { cardinal: f[0] },
  mn: { cardinal: f[0] },
  mo: { cardinal: f[25], ordinal: f[0] },
  mr: { cardinal: f[2], ordinal: f[47] },
  mt: { cardinal: f[26] },
  nah: { cardinal: f[0] },
  naq: { cardinal: f[19] },
  nb: { cardinal: f[0] },
  nd: { cardinal: f[0] },
  ne: { cardinal: f[0], ordinal: f[48] },
  nl: { cardinal: f[4] },
  nn: { cardinal: f[0] },
  nnh: { cardinal: f[0] },
  no: { cardinal: f[0] },
  nr: { cardinal: f[0] },
  nso: { cardinal: f[1] },
  ny: { cardinal: f[0] },
  nyn: { cardinal: f[0] },
  om: { cardinal: f[0] },
  or: { cardinal: f[0], ordinal: f[49] },
  os: { cardinal: f[0] },
  pa: { cardinal: f[1] },
  pap: { cardinal: f[0] },
  pl: { cardinal: f[27] },
  prg: { cardinal: f[23] },
  ps: { cardinal: f[0] },
  pt: { cardinal: f[28] },
  'pt-PT': { cardinal: f[4] },
  rm: { cardinal: f[0] },
  ro: { cardinal: f[25], ordinal: f[0] },
  rof: { cardinal: f[0] },
  ru: { cardinal: f[29] },
  rwk: { cardinal: f[0] },
  saq: { cardinal: f[0] },
  sc: { cardinal: f[4], ordinal: f[43] },
  scn: { cardinal: f[4], ordinal: f[43] },
  sd: { cardinal: f[0] },
  sdh: { cardinal: f[0] },
  se: { cardinal: f[19] },
  seh: { cardinal: f[0] },
  sh: { cardinal: f[7] },
  shi: { cardinal: f[30] },
  si: { cardinal: f[31] },
  sk: { cardinal: f[8] },
  sl: { cardinal: f[32] },
  sma: { cardinal: f[19] },
  smi: { cardinal: f[19] },
  smj: { cardinal: f[19] },
  smn: { cardinal: f[19] },
  sms: { cardinal: f[19] },
  sn: { cardinal: f[0] },
  so: { cardinal: f[0] },
  sq: { cardinal: f[0], ordinal: f[50] },
  sr: { cardinal: f[7] },
  ss: { cardinal: f[0] },
  ssy: { cardinal: f[0] },
  st: { cardinal: f[0] },
  sv: { cardinal: f[4], ordinal: f[51] },
  sw: { cardinal: f[4] },
  syr: { cardinal: f[0] },
  ta: { cardinal: f[0] },
  te: { cardinal: f[0] },
  teo: { cardinal: f[0] },
  ti: { cardinal: f[1] },
  tig: { cardinal: f[0] },
  tk: { cardinal: f[0], ordinal: f[52] },
  tl: { cardinal: f[13], ordinal: f[0] },
  tn: { cardinal: f[0] },
  tr: { cardinal: f[0] },
  ts: { cardinal: f[0] },
  tzm: { cardinal: f[33] },
  ug: { cardinal: f[0] },
  uk: { cardinal: f[29], ordinal: f[53] },
  ur: { cardinal: f[4] },
  uz: { cardinal: f[0] },
  ve: { cardinal: f[0] },
  vo: { cardinal: f[0] },
  vun: { cardinal: f[0] },
  wa: { cardinal: f[1] },
  wae: { cardinal: f[0] },
  xh: { cardinal: f[0] },
  xog: { cardinal: f[0] },
  yi: { cardinal: f[4] },
  zu: { cardinal: f[2] },
  lo: { ordinal: f[0] },
  ms: { ordinal: f[0] },
  vi: { ordinal: f[0] }
};

var formatMessageInterpret = createCommonjsModule(function (module, exports) {




/*::
import type {
  AST,
  SubMessages
} from '../format-message-parse'
type Locale = string
type Locales = Locale | Locale[]
type Placeholder = any[] // https://github.com/facebook/flow/issues/4050
export type Type = (Placeholder, Locales) => (any, ?Object) => any
export type Types = { [string]: Type }
*/

exports = module.exports = function interpret (
  ast/*: AST */,
  locale/*:: ?: Locales */,
  types/*:: ?: Types */
)/*: (args?: Object) => string */ {
  return interpretAST(ast, null, locale || 'en', types || {}, true)
};

exports.toParts = function toParts (
  ast/*: AST */,
  locale/*:: ?: Locales */,
  types/*:: ?: Types */
)/*: (args?: Object) => any[] */ {
  return interpretAST(ast, null, locale || 'en', types || {}, false)
};

function interpretAST (
  elements/*: any[] */,
  parent/*: ?Placeholder */,
  locale/*: Locales */,
  types/*: Types */,
  join/*: boolean */
)/*: Function */ {
  var parts = elements.map(function (element) {
    return interpretElement(element, parent, locale, types, join)
  });

  if (!join) {
    return function format (args) {
      return parts.reduce(function (parts, part) {
        return parts.concat(part(args))
      }, [])
    }
  }

  if (parts.length === 1) return parts[0]
  return function format (args) {
    var message = '';
    for (var e = 0; e < parts.length; ++e) {
      message += parts[e](args);
    }
    return message
  }
}

function interpretElement (
  element/*: Placeholder */,
  parent/*: ?Placeholder */,
  locale/*: Locales */,
  types/*: Types */,
  join/*: boolean */
)/*: Function */ {
  if (typeof element === 'string') {
    var value/*: string */ = element;
    return function format () { return value }
  }

  var id = element[0];
  var type = element[1];

  if (parent && element[0] === '#') {
    id = parent[0];
    var offset = parent[2];
    var formatter = (types.number || defaults.number)([id, 'number'], locale);
    return function format (args) {
      return formatter(getArg(id, args) - offset, args)
    }
  }

  // pre-process children
  var children;
  if (type === 'plural' || type === 'selectordinal') {
    children = {};
    Object.keys(element[3]).forEach(function (key) {
      children[key] = interpretAST(element[3][key], element, locale, types, join);
    });
    element = [element[0], element[1], element[2], children];
  } else if (element[2] && typeof element[2] === 'object') {
    children = {};
    Object.keys(element[2]).forEach(function (key) {
      children[key] = interpretAST(element[2][key], element, locale, types, join);
    });
    element = [element[0], element[1], children];
  }

  var getFrmt = type && (types[type] || defaults[type]);
  if (getFrmt) {
    var frmt = getFrmt(element, locale);
    return function format (args) {
      return frmt(getArg(id, args), args)
    }
  }

  return join
    ? function format (args) { return String(getArg(id, args)) }
    : function format (args) { return getArg(id, args) }
}

function getArg (id/*: string */, args/*: ?Object */)/*: any */ {
  if (args && (id in args)) return args[id]
  var parts = id.split('.');
  var a = args;
  for (var i = 0, ii = parts.length; a && i < ii; ++i) {
    a = a[parts[i]];
  }
  return a
}

function interpretNumber (element/*: Placeholder */, locales/*: Locales */) {
  var style = element[2];
  var options = formatMessageFormats.number[style] || formatMessageFormats.parseNumberPattern(style) || formatMessageFormats.number.default;
  return new Intl.NumberFormat(locales, options).format
}

function interpretDuration (element/*: Placeholder */, locales/*: Locales */) {
  var style = element[2];
  var options = formatMessageFormats.duration[style] || formatMessageFormats.duration.default;
  var fs = new Intl.NumberFormat(locales, options.seconds).format;
  var fm = new Intl.NumberFormat(locales, options.minutes).format;
  var fh = new Intl.NumberFormat(locales, options.hours).format;
  var sep = /^fi$|^fi-|^da/.test(String(locales)) ? '.' : ':';

  return function (s, args) {
    s = +s;
    if (!isFinite(s)) return fs(s)
    var h = ~~(s / 60 / 60); // ~~ acts much like Math.trunc
    var m = ~~(s / 60 % 60);
    var dur = (h ? (fh(Math.abs(h)) + sep) : '') +
      fm(Math.abs(m)) + sep + fs(Math.abs(s % 60));
    return s < 0 ? fh(-1).replace(fh(1), dur) : dur
  }
}

function interpretDateTime (element/*: Placeholder */, locales/*: Locales */) {
  var type = element[1];
  var style = element[2];
  var options = formatMessageFormats[type][style] || formatMessageFormats.parseDatePattern(style) || formatMessageFormats[type].default;
  return new Intl.DateTimeFormat(locales, options).format
}

function interpretPlural (element/*: Placeholder */, locales/*: Locales */) {
  var type = element[1];
  var pluralType = type === 'selectordinal' ? 'ordinal' : 'cardinal';
  var offset = element[2];
  var children = element[3];
  var pluralRules;
  if (Intl.PluralRules && Intl.PluralRules.supportedLocalesOf(locales).length > 0) {
    pluralRules = new Intl.PluralRules(locales, { type: pluralType });
  } else {
    var locale = lookupClosestLocale(locales, plurals);
    var select = (locale && plurals[locale][pluralType]) || returnOther;
    pluralRules = { select: select };
  }

  return function (value, args) {
    var clause =
      children['=' + +value] ||
      children[pluralRules.select(value - offset)] ||
      children.other;
    return clause(args)
  }
}

function returnOther (/*:: n:number */) { return 'other' }

function interpretSelect (element/*: Placeholder */, locales/*: Locales */) {
  var children = element[2];
  return function (value, args) {
    var clause = children[value] || children.other;
    return clause(args)
  }
}

var defaults/*: Types */ = {
  number: interpretNumber,
  ordinal: interpretNumber, // TODO: support rbnf
  spellout: interpretNumber, // TODO: support rbnf
  duration: interpretDuration,
  date: interpretDateTime,
  time: interpretDateTime,
  plural: interpretPlural,
  selectordinal: interpretPlural,
  select: interpretSelect
};
exports.types = defaults;
});
var formatMessageInterpret_1 = formatMessageInterpret.toParts;
var formatMessageInterpret_2 = formatMessageInterpret.types;

var formatMessageParse = createCommonjsModule(function (module, exports) {

/*::
export type AST = Element[]
export type Element = string | Placeholder
export type Placeholder = Plural | Styled | Typed | Simple
export type Plural = [ string, 'plural' | 'selectordinal', number, SubMessages ]
export type Styled = [ string, string, string | SubMessages ]
export type Typed = [ string, string ]
export type Simple = [ string ]
export type SubMessages = { [string]: AST }
export type Token = [ TokenType, string ]
export type TokenType = 'text' | 'space' | 'id' | 'type' | 'style' | 'offset' | 'number' | 'selector' | 'syntax'
type Context = {|
  pattern: string,
  index: number,
  tagsType: ?string,
  tokens: ?Token[]
|}
*/

var ARG_OPN = '{';
var ARG_CLS = '}';
var ARG_SEP = ',';
var NUM_ARG = '#';
var TAG_OPN = '<';
var TAG_CLS = '>';
var TAG_END = '</';
var TAG_SELF_CLS = '/>';
var ESC = '\'';
var OFFSET = 'offset:';
var simpleTypes = [
  'number',
  'date',
  'time',
  'ordinal',
  'duration',
  'spellout'
];
var submTypes = [
  'plural',
  'select',
  'selectordinal'
];

/**
 * parse
 *
 * Turns this:
 *  `You have { numBananas, plural,
 *       =0 {no bananas}
 *      one {a banana}
 *    other {# bananas}
 *  } for sale`
 *
 * into this:
 *  [ "You have ", [ "numBananas", "plural", 0, {
 *       "=0": [ "no bananas" ],
 *      "one": [ "a banana" ],
 *    "other": [ [ '#' ], " bananas" ]
 *  } ], " for sale." ]
 *
 * tokens:
 *  [
 *    [ "text", "You have " ],
 *    [ "syntax", "{" ],
 *    [ "space", " " ],
 *    [ "id", "numBananas" ],
 *    [ "syntax", ", " ],
 *    [ "space", " " ],
 *    [ "type", "plural" ],
 *    [ "syntax", "," ],
 *    [ "space", "\n     " ],
 *    [ "selector", "=0" ],
 *    [ "space", " " ],
 *    [ "syntax", "{" ],
 *    [ "text", "no bananas" ],
 *    [ "syntax", "}" ],
 *    [ "space", "\n    " ],
 *    [ "selector", "one" ],
 *    [ "space", " " ],
 *    [ "syntax", "{" ],
 *    [ "text", "a banana" ],
 *    [ "syntax", "}" ],
 *    [ "space", "\n  " ],
 *    [ "selector", "other" ],
 *    [ "space", " " ],
 *    [ "syntax", "{" ],
 *    [ "syntax", "#" ],
 *    [ "text", " bananas" ],
 *    [ "syntax", "}" ],
 *    [ "space", "\n" ],
 *    [ "syntax", "}" ],
 *    [ "text", " for sale." ]
 *  ]
 **/
exports = module.exports = function parse (
  pattern/*: string */,
  options/*:: ?: { tagsType?: string, tokens?: Token[] } */
)/*: AST */ {
  return parseAST({
    pattern: String(pattern),
    index: 0,
    tagsType: (options && options.tagsType) || null,
    tokens: (options && options.tokens) || null
  }, '')
};

function parseAST (current/*: Context */, parentType/*: string */)/*: AST */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var elements/*: AST */ = [];
  var start = current.index;
  var text = parseText(current, parentType);
  if (text) elements.push(text);
  if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);
  while (current.index < length) {
    if (pattern[current.index] === ARG_CLS) {
      if (!parentType) throw expected(current)
      break
    }
    if (parentType && current.tagsType && pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) break
    elements.push(parsePlaceholder(current));
    start = current.index;
    text = parseText(current, parentType);
    if (text) elements.push(text);
    if (text && current.tokens) current.tokens.push(['text', pattern.slice(start, current.index)]);
  }
  return elements
}

function parseText (current/*: Context */, parentType/*: string */)/*: string */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var isHashSpecial = (parentType === 'plural' || parentType === 'selectordinal');
  var isAngleSpecial = !!current.tagsType;
  var isArgStyle = (parentType === '{style}');
  var text = '';
  while (current.index < length) {
    var char = pattern[current.index];
    if (
      char === ARG_OPN || char === ARG_CLS ||
      (isHashSpecial && char === NUM_ARG) ||
      (isAngleSpecial && char === TAG_OPN) ||
      (isArgStyle && isWhitespace(char.charCodeAt(0)))
    ) {
      break
    } else if (char === ESC) {
      char = pattern[++current.index];
      if (char === ESC) { // double is always 1 '
        text += char;
        ++current.index;
      } else if (
        // only when necessary
        char === ARG_OPN || char === ARG_CLS ||
        (isHashSpecial && char === NUM_ARG) ||
        (isAngleSpecial && char === TAG_OPN) ||
        isArgStyle
      ) {
        text += char;
        while (++current.index < length) {
          char = pattern[current.index];
          if (char === ESC && pattern[current.index + 1] === ESC) { // double is always 1 '
            text += ESC;
            ++current.index;
          } else if (char === ESC) { // end of quoted
            ++current.index;
            break
          } else {
            text += char;
          }
        }
      } else { // lone ' is just a '
        text += ESC;
        // already incremented
      }
    } else {
      text += char;
      ++current.index;
    }
  }
  return text
}

function isWhitespace (code/*: number */)/*: boolean */ {
  return (
    (code >= 0x09 && code <= 0x0D) ||
    code === 0x20 || code === 0x85 || code === 0xA0 || code === 0x180E ||
    (code >= 0x2000 && code <= 0x200D) ||
    code === 0x2028 || code === 0x2029 || code === 0x202F || code === 0x205F ||
    code === 0x2060 || code === 0x3000 || code === 0xFEFF
  )
}

function skipWhitespace (current/*: Context */)/*: void */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var start = current.index;
  while (current.index < length && isWhitespace(pattern.charCodeAt(current.index))) {
    ++current.index;
  }
  if (start < current.index && current.tokens) {
    current.tokens.push(['space', current.pattern.slice(start, current.index)]);
  }
}

function parsePlaceholder (current/*: Context */)/*: Placeholder */ {
  var pattern = current.pattern;
  if (pattern[current.index] === NUM_ARG) {
    if (current.tokens) current.tokens.push(['syntax', NUM_ARG]);
    ++current.index; // move passed #
    return [NUM_ARG]
  }

  var tag = parseTag(current);
  if (tag) return tag

  /* istanbul ignore if should be unreachable if parseAST and parseText are right */
  if (pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN)
  if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
  ++current.index; // move passed {
  skipWhitespace(current);

  var id = parseId(current);
  if (!id) throw expected(current, 'placeholder id')
  if (current.tokens) current.tokens.push(['id', id]);
  skipWhitespace(current);

  var char = pattern[current.index];
  if (char === ARG_CLS) { // end placeholder
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    ++current.index; // move passed }
    return [id]
  }

  if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS)
  if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
  ++current.index; // move passed ,
  skipWhitespace(current);

  var type = parseId(current);
  if (!type) throw expected(current, 'placeholder type')
  if (current.tokens) current.tokens.push(['type', type]);
  skipWhitespace(current);
  char = pattern[current.index];
  if (char === ARG_CLS) { // end placeholder
    if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
    if (type === 'plural' || type === 'selectordinal' || type === 'select') {
      throw expected(current, type + ' sub-messages')
    }
    ++current.index; // move passed }
    return [id, type]
  }

  if (char !== ARG_SEP) throw expected(current, ARG_SEP + ' or ' + ARG_CLS)
  if (current.tokens) current.tokens.push(['syntax', ARG_SEP]);
  ++current.index; // move passed ,
  skipWhitespace(current);

  var arg;
  if (type === 'plural' || type === 'selectordinal') {
    var offset = parsePluralOffset(current);
    skipWhitespace(current);
    arg = [id, type, offset, parseSubMessages(current, type)];
  } else if (type === 'select') {
    arg = [id, type, parseSubMessages(current, type)];
  } else if (simpleTypes.indexOf(type) >= 0) {
    arg = [id, type, parseSimpleFormat(current)];
  } else { // custom placeholder type
    var index = current.index;
    var format/*: string | SubMessages */ = parseSimpleFormat(current);
    skipWhitespace(current);
    if (pattern[current.index] === ARG_OPN) {
      current.index = index; // rewind, since should have been submessages
      format = parseSubMessages(current, type);
    }
    arg = [id, type, format];
  }

  skipWhitespace(current);
  if (pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS)
  if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
  ++current.index; // move passed }
  return arg
}

function parseTag (current/*: Context */)/*: ?Placeholder */ {
  var tagsType = current.tagsType;
  if (!tagsType || current.pattern[current.index] !== TAG_OPN) return

  if (current.pattern.slice(current.index, current.index + TAG_END.length) === TAG_END) {
    throw expected(current, null, 'closing tag without matching opening tag')
  }
  if (current.tokens) current.tokens.push(['syntax', TAG_OPN]);
  ++current.index; // move passed <

  var id = parseId(current, true);
  if (!id) throw expected(current, 'placeholder id')
  if (current.tokens) current.tokens.push(['id', id]);
  skipWhitespace(current);

  if (current.pattern.slice(current.index, current.index + TAG_SELF_CLS.length) === TAG_SELF_CLS) {
    if (current.tokens) current.tokens.push(['syntax', TAG_SELF_CLS]);
    current.index += TAG_SELF_CLS.length;
    return [id, tagsType]
  }
  if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS)
  if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
  ++current.index; // move passed >

  var children = parseAST(current, tagsType);

  var end = current.index;
  if (current.pattern.slice(current.index, current.index + TAG_END.length) !== TAG_END) throw expected(current, TAG_END + id + TAG_CLS)
  if (current.tokens) current.tokens.push(['syntax', TAG_END]);
  current.index += TAG_END.length;
  var closeId = parseId(current, true);
  if (closeId && current.tokens) current.tokens.push(['id', closeId]);
  if (id !== closeId) {
    current.index = end; // rewind for better error message
    throw expected(current, TAG_END + id + TAG_CLS, TAG_END + closeId + TAG_CLS)
  }
  skipWhitespace(current);
  if (current.pattern[current.index] !== TAG_CLS) throw expected(current, TAG_CLS)
  if (current.tokens) current.tokens.push(['syntax', TAG_CLS]);
  ++current.index; // move passed >

  return [id, tagsType, { children: children }]
}

function parseId (current/*: Context */, isTag/*:: ?: boolean */)/*: string */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var id = '';
  while (current.index < length) {
    var char = pattern[current.index];
    if (
      char === ARG_OPN || char === ARG_CLS || char === ARG_SEP ||
      char === NUM_ARG || char === ESC || isWhitespace(char.charCodeAt(0)) ||
      (isTag && (char === TAG_OPN || char === TAG_CLS || char === '/'))
    ) break
    id += char;
    ++current.index;
  }
  return id
}

function parseSimpleFormat (current/*: Context */)/*: string */ {
  var start = current.index;
  var style = parseText(current, '{style}');
  if (!style) throw expected(current, 'placeholder style name')
  if (current.tokens) current.tokens.push(['style', current.pattern.slice(start, current.index)]);
  return style
}

function parsePluralOffset (current/*: Context */)/*: number */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var offset = 0;
  if (pattern.slice(current.index, current.index + OFFSET.length) === OFFSET) {
    if (current.tokens) current.tokens.push(['offset', 'offset'], ['syntax', ':']);
    current.index += OFFSET.length; // move passed offset:
    skipWhitespace(current);
    var start = current.index;
    while (current.index < length && isDigit(pattern.charCodeAt(current.index))) {
      ++current.index;
    }
    if (start === current.index) throw expected(current, 'offset number')
    if (current.tokens) current.tokens.push(['number', pattern.slice(start, current.index)]);
    offset = +pattern.slice(start, current.index);
  }
  return offset
}

function isDigit (code/*: number */)/*: boolean */ {
  return (code >= 0x30 && code <= 0x39)
}

function parseSubMessages (current/*: Context */, parentType/*: string */)/*: SubMessages */ {
  var pattern = current.pattern;
  var length = pattern.length;
  var options/*: SubMessages */ = {};
  while (current.index < length && pattern[current.index] !== ARG_CLS) {
    var selector = parseId(current);
    if (!selector) throw expected(current, 'sub-message selector')
    if (current.tokens) current.tokens.push(['selector', selector]);
    skipWhitespace(current);
    options[selector] = parseSubMessage(current, parentType);
    skipWhitespace(current);
  }
  if (!options.other && submTypes.indexOf(parentType) >= 0) {
    throw expected(current, null, null, '"other" sub-message must be specified in ' + parentType)
  }
  return options
}

function parseSubMessage (current/*: Context */, parentType/*: string */)/*: AST */ {
  if (current.pattern[current.index] !== ARG_OPN) throw expected(current, ARG_OPN + ' to start sub-message')
  if (current.tokens) current.tokens.push(['syntax', ARG_OPN]);
  ++current.index; // move passed {
  var message = parseAST(current, parentType);
  if (current.pattern[current.index] !== ARG_CLS) throw expected(current, ARG_CLS + ' to end sub-message')
  if (current.tokens) current.tokens.push(['syntax', ARG_CLS]);
  ++current.index; // move passed }
  return message
}

function expected (current/*: Context */, expected/*:: ?: ?string */, found/*:: ?: ?string */, message/*:: ?: string */) {
  var pattern = current.pattern;
  var lines = pattern.slice(0, current.index).split(/\r?\n/);
  var offset = current.index;
  var line = lines.length;
  var column = lines.slice(-1)[0].length;
  found = found || (
    (current.index >= pattern.length) ? 'end of message pattern'
      : (parseId(current) || pattern[current.index])
  );
  if (!message) message = errorMessage(expected, found);
  message += ' in ' + pattern.replace(/\r?\n/g, '\n');
  return new SyntaxError(message, expected, found, offset, line, column)
}

function errorMessage (expected/*: ?string */, found/* string */) {
  if (!expected) return 'Unexpected ' + found + ' found'
  return 'Expected ' + expected + ' but found ' + found
}

/**
 * SyntaxError
 *  Holds information about bad syntax found in a message pattern
 **/
function SyntaxError (message/*: string */, expected/*: ?string */, found/*: ?string */, offset/*: number */, line/*: number */, column/*: number */) {
  Error.call(this, message);
  this.name = 'SyntaxError';
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.offset = offset;
  this.line = line;
  this.column = column;
}
SyntaxError.prototype = Object.create(Error.prototype);
exports.SyntaxError = SyntaxError;
});
var formatMessageParse_1 = formatMessageParse.SyntaxError;

var supportedExp = new RegExp(
  '^(' + Object.keys(plurals).join('|') + ')\\b'
);

/*::
import type { Types } from 'format-message-interpret'
import type { AST } from 'format-message-parse'
type Options = {
  types: Types
}
type Internals = {
  ast: AST,
  format: (args?: Object) => string,
  locale: string,
  locales?: string | string[],
  toParts?: (args?: Object) => any[],
  options?: Options
}
*/

var internals/*: WeakMap<Object, Internals> */ = new WeakMap();

/*!
 * Intl.MessageFormat prollyfill
 * Copyright(c) 2015 Andy VanWagoner
 * MIT licensed
 **/
function MessageFormat (
  pattern/*: string */,
  locales/*:: ?: string | string[] */,
  options/*:: ?: Options */
) {
  if (!(this instanceof MessageFormat) || internals.has(this)) {
    throw new TypeError('calling MessageFormat constructor without new is invalid')
  }
  var ast = formatMessageParse(pattern);
  internals.set(this, {
    ast: ast,
    format: formatMessageInterpret(ast, locales, options && options.types),
    locale: MessageFormat.supportedLocalesOf(locales)[0] || 'en',
    locales: locales,
    options: options
  });
}
var messageFormat = MessageFormat;

// $FlowFixMe It thinks `value` needs to be defined for format
Object.defineProperties(MessageFormat.prototype, {
  format: {
    configurable: true,
    get: function format () {
      var values = internals.get(this);
      if (!values) throw new TypeError('MessageFormat.prototype.format called on value that\'s not an object initialized as a MessageFormat')
      return values.format
    }
  },
  formatToParts: {
    configurable: true,
    writable: true,
    value: function formatToParts (args/*:: ?: Object */) {
      var values = internals.get(this);
      if (!values) throw new TypeError('MessageFormat.prototype.formatToParts called on value that\'s not an object initialized as a MessageFormat')
      var frmt = values.toParts || (values.toParts = formatMessageInterpret.toParts(
        values.ast,
        values.locales,
        values.options && values.options.types
      ));
      return frmt(args)
    }
  },
  resolvedOptions: {
    configurable: true,
    writable: true,
    value: function resolvedOptions () {
      var values = internals.get(this);
      if (!values) throw new TypeError('MessageFormat.prototype.resolvedOptions called on value that\'s not an object initialized as a MessageFormat')
      return {
        locale: values.locale
      }
    }
  }
});

/* istanbul ignore else */
if (typeof Symbol !== 'undefined') {
  Object.defineProperty(MessageFormat.prototype, Symbol.toStringTag, { value: 'Object' });
}

Object.defineProperties(MessageFormat, {
  supportedLocalesOf: {
    configurable: true,
    writable: true,
    value: function supportedLocalesOf (requestedLocales/*:: ?: string | string[] */) {
      return [].concat(
        Intl.NumberFormat.supportedLocalesOf(requestedLocales),
        Intl.DateTimeFormat.supportedLocalesOf(requestedLocales),
        Intl.PluralRules ? Intl.PluralRules.supportedLocalesOf(requestedLocales) : [],
        [].concat(requestedLocales || []).filter(function (locale) {
          return supportedExp.test(locale)
        })
      ).filter(function (v, i, a) { return a.indexOf(v) === i })
    }
  }
});

export default messageFormat;
