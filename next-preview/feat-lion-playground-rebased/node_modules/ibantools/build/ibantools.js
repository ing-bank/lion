/*!
 * @license
 * Copyright Saša Jovanić
 * Licensed under the Mozilla Public License, Version 2.0 or the MIT license,
 * at your option. This file may not be copied, modified, or distributed
 * except according to those terms.
 * SPDX-FileCopyrightText: Saša Jovanić
 * SPDX-License-Identifier: MIT or MPL/2.0
 */
/**
 * Validation, extraction and creation of IBAN, BBAN, BIC/SWIFT numbers plus some other helpful stuff
 * @package Documentation
 * @author Saša Jovanić
 * @module ibantools
 * @version 4.5.4
 * @license MIT or MPL-2.0
 * @preferred
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.countrySpecs = exports.setCountryBBANValidation = exports.ValidationErrorsBIC = exports.ValidationErrorsIBAN = void 0;
exports.isValidIBAN = isValidIBAN;
exports.validateIBAN = validateIBAN;
exports.isValidBBAN = isValidBBAN;
exports.isSEPACountry = isSEPACountry;
exports.isQRIBAN = isQRIBAN;
exports.composeIBAN = composeIBAN;
exports.extractIBAN = extractIBAN;
exports.electronicFormatIBAN = electronicFormatIBAN;
exports.friendlyFormatIBAN = friendlyFormatIBAN;
exports.getCountrySpecifications = getCountrySpecifications;
exports.isValidBIC = isValidBIC;
exports.validateBIC = validateBIC;
exports.extractBIC = extractBIC;
/**
 * Validate IBAN
 * ```
 * // returns true
 * ibantools.isValidIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * // returns false
 * ibantools.isValidIBAN("NL92ABNA0517164300");
 * ```
 * ```
 * // returns true
 * ibantools.isValidIBAN('CH4431999123000889012');
 * ```
 * ```
 * // returns false
 * ibantools.isValidIBAN('CH4431999123000889012', { allowQRIBAN: false });
 * ```
 */
function isValidIBAN(iban, validationOptions = { allowQRIBAN: true }) {
    if (iban === undefined || iban === null)
        return false;
    const reg = new RegExp('^[0-9]{2}$', '');
    const countryCode = iban.slice(0, 2);
    const spec = exports.countrySpecs[countryCode];
    if (spec === undefined || spec.bban_regexp === undefined || spec.bban_regexp === null || spec.chars === undefined)
        return false;
    return (spec.chars === iban.length &&
        reg.test(iban.slice(2, 4)) &&
        isValidBBAN(iban.slice(4), countryCode) &&
        isValidIBANChecksum(iban) &&
        (validationOptions.allowQRIBAN || !isQRIBAN(iban)));
}
/**
 * IBAM validation errors
 */
var ValidationErrorsIBAN;
(function (ValidationErrorsIBAN) {
    ValidationErrorsIBAN[ValidationErrorsIBAN["NoIBANProvided"] = 0] = "NoIBANProvided";
    ValidationErrorsIBAN[ValidationErrorsIBAN["NoIBANCountry"] = 1] = "NoIBANCountry";
    ValidationErrorsIBAN[ValidationErrorsIBAN["WrongBBANLength"] = 2] = "WrongBBANLength";
    ValidationErrorsIBAN[ValidationErrorsIBAN["WrongBBANFormat"] = 3] = "WrongBBANFormat";
    ValidationErrorsIBAN[ValidationErrorsIBAN["ChecksumNotNumber"] = 4] = "ChecksumNotNumber";
    ValidationErrorsIBAN[ValidationErrorsIBAN["WrongIBANChecksum"] = 5] = "WrongIBANChecksum";
    ValidationErrorsIBAN[ValidationErrorsIBAN["WrongAccountBankBranchChecksum"] = 6] = "WrongAccountBankBranchChecksum";
    ValidationErrorsIBAN[ValidationErrorsIBAN["QRIBANNotAllowed"] = 7] = "QRIBANNotAllowed";
})(ValidationErrorsIBAN || (exports.ValidationErrorsIBAN = ValidationErrorsIBAN = {}));
/**
 * validateIBAN
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibantools.validateIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibantools.validateIBAN('CH4431999123000889012');
 * ```
 * ```
 * // returns {errorCodes: [7], valid: false}
 * ibantools.validateIBAN('CH4431999123000889012', { allowQRIBAN: false });
 * ```
 */
function validateIBAN(iban, validationOptions = { allowQRIBAN: true }) {
    const result = { errorCodes: [], valid: true };
    if (iban !== undefined && iban !== null && iban !== '') {
        const spec = exports.countrySpecs[iban.slice(0, 2)];
        if (!spec || !(spec.bban_regexp || spec.chars)) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.NoIBANCountry);
            return result;
        }
        if (spec && spec.chars && spec.chars !== iban.length) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.WrongBBANLength);
        }
        if (spec && spec.bban_regexp && !checkFormatBBAN(iban.slice(4), spec.bban_regexp)) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.WrongBBANFormat);
        }
        if (spec && spec.bban_validation_func && !spec.bban_validation_func(iban.slice(4))) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.WrongAccountBankBranchChecksum);
        }
        const reg = new RegExp('^[0-9]{2}$', '');
        if (!reg.test(iban.slice(2, 4))) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.ChecksumNotNumber);
        }
        if (result.errorCodes.indexOf(ValidationErrorsIBAN.WrongBBANFormat) !== -1 || !isValidIBANChecksum(iban)) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.WrongIBANChecksum);
        }
        if (!validationOptions.allowQRIBAN && isQRIBAN(iban)) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsIBAN.QRIBANNotAllowed);
        }
    }
    else {
        result.valid = false;
        result.errorCodes.push(ValidationErrorsIBAN.NoIBANProvided);
    }
    return result;
}
/**
 * Validate BBAN
 *
 * ```
 * // returns true
 * ibantools.isValidBBAN("ABNA0417164300", "NL");
 * ```
 * ```
 * // returns false
 * ibantools.isValidBBAN("A7NA0517164300", "NL");
 * ```
 */
function isValidBBAN(bban, countryCode) {
    if (bban === undefined || bban === null || countryCode === undefined || countryCode === null)
        return false;
    const spec = exports.countrySpecs[countryCode];
    if (spec === undefined ||
        spec === null ||
        spec.bban_regexp === undefined ||
        spec.bban_regexp === null ||
        spec.chars === undefined ||
        spec.chars === null)
        return false;
    if (spec.chars - 4 === bban.length && checkFormatBBAN(bban, spec.bban_regexp)) {
        if (spec.bban_validation_func) {
            return spec.bban_validation_func(bban.replace(/[\s.]+/g, ''));
        }
        return true;
    }
    return false;
}
/**
 * Validate if country code is from a SEPA country
 * ```
 * // returns true
 * ibantools.isSEPACountry("NL");
 * ```
 * ```
 * // returns false
 * ibantools.isSEPACountry("PK");
 * ```
 */
function isSEPACountry(countryCode) {
    if (countryCode !== undefined && countryCode !== null) {
        const spec = exports.countrySpecs[countryCode];
        if (spec !== undefined) {
            return spec.SEPA ? spec.SEPA : false;
        }
    }
    return false;
}
/**
 * Check if IBAN is QR-IBAN
 * ```
 * // returns true
 * ibantools.isQRIBAN("CH4431999123000889012");
 * ```
 * ```
 * // returns false
 * ibantools.isQRIBAN("NL92ABNA0517164300");
 * ```
 */
function isQRIBAN(iban) {
    if (iban === undefined || iban === null)
        return false;
    const countryCode = iban.slice(0, 2);
    const QRIBANCountries = ['LI', 'CH'];
    if (!QRIBANCountries.includes(countryCode))
        return false;
    const reg = new RegExp('^3[0-1]{1}[0-9]{3}$', '');
    return reg.test(iban.slice(4, 9));
}
/**
 * composeIBAN
 *
 * ```
 * // returns NL91ABNA0417164300
 * ibantools.composeIBAN({ countryCode: "NL", bban: "ABNA0417164300" });
 * ```
 */
function composeIBAN(params) {
    const formated_bban = electronicFormatIBAN(params.bban) || '';
    if (params.countryCode === null || params.countryCode === undefined) {
        return null;
    }
    const spec = exports.countrySpecs[params.countryCode];
    if (formated_bban !== '' &&
        spec !== undefined &&
        spec.chars &&
        spec.chars !== null &&
        spec.chars === formated_bban.length + 4 &&
        spec.bban_regexp &&
        spec.bban_regexp !== null &&
        checkFormatBBAN(formated_bban, spec.bban_regexp)) {
        const checksom = mod9710Iban(params.countryCode + '00' + formated_bban);
        return params.countryCode + ('0' + (98 - checksom)).slice(-2) + formated_bban;
    }
    return null;
}
/**
 * extractIBAN
 * ```
 * // returns {iban: "NL91ABNA0417164300", bban: "ABNA0417164300", countryCode: "NL", valid: true, accountNumber: '0417164300', bankIdentifier: 'ABNA'}
 * ibantools.extractIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
function extractIBAN(iban) {
    const result = {};
    const eFormatIBAN = electronicFormatIBAN(iban);
    result.iban = eFormatIBAN || iban;
    if (!!eFormatIBAN && isValidIBAN(eFormatIBAN)) {
        result.bban = eFormatIBAN.slice(4);
        result.countryCode = eFormatIBAN.slice(0, 2);
        result.valid = true;
        const spec = exports.countrySpecs[result.countryCode];
        if (spec.account_indentifier) {
            const ac = spec.account_indentifier.split('-');
            const starting = parseInt(ac[0]);
            const ending = parseInt(ac[1]);
            result.accountNumber = result.iban.slice(starting, ending + 1);
        }
        if (spec.bank_identifier) {
            const ac = spec.bank_identifier.split('-');
            const starting = parseInt(ac[0]);
            const ending = parseInt(ac[1]);
            result.bankIdentifier = result.bban.slice(starting, ending + 1);
        }
        if (spec.branch_indentifier) {
            const ac = spec.branch_indentifier.split('-');
            const starting = parseInt(ac[0]);
            const ending = parseInt(ac[1]);
            result.branchIdentifier = result.bban.slice(starting, ending + 1);
        }
    }
    else {
        result.valid = false;
    }
    return result;
}
/**
 * Check BBAN format
 *
 * @ignore
 */
function checkFormatBBAN(bban, bformat) {
    const reg = new RegExp(bformat, '');
    return reg.test(bban);
}
/**
 * Get IBAN in electronic format (no spaces)
 * IBAN validation is not performed.
 * When non-string value for IBAN is provided, returns null.
 * ```
 * // returns "NL91ABNA0417164300"
 * ibantools.electronicFormatIBAN("NL91 ABNA 0417 1643 00");
 * ```
 */
function electronicFormatIBAN(iban) {
    if (typeof iban !== 'string') {
        return null;
    }
    return iban.replace(/[-\ ]/g, '').toUpperCase();
}
/**
 * Get IBAN in friendly format (separated after every 4 characters)
 * IBAN validation is not performed.
 * When non-string value for IBAN is provided, returns null.
 * ```
 * // returns "NL91 ABNA 0417 1643 00"
 * ibantools.friendlyFormatIBAN("NL91ABNA0417164300");
 * ```
 * ```
 * // returns "NL91-ABNA-0417-1643-00"
 * ibantools.friendlyFormatIBAN("NL91ABNA0417164300","-");
 * ```
 */
function friendlyFormatIBAN(iban, separator) {
    if (typeof iban !== 'string') {
        return null;
    }
    if (separator === undefined || separator === null) {
        separator = ' ';
    }
    const electronic_iban = electronicFormatIBAN(iban);
    /* istanbul ignore if */
    if (electronic_iban === null) {
        return null;
    }
    return electronic_iban.replace(/(.{4})(?!$)/g, '$1' + separator);
}
/**
 * Calculate checksum of IBAN and compares it with checksum provided in IBAN Registry
 *
 * @ignore
 */
function isValidIBANChecksum(iban) {
    const countryCode = iban.slice(0, 2);
    const providedChecksum = parseInt(iban.slice(2, 4), 10);
    const bban = iban.slice(4);
    // Wikipedia[validating_iban] says there are a specif way to check if a IBAN is valid but
    // it. It says 'If the remainder is 1, the check digit test is passed and the
    // IBAN might be valid.'. might, MIGHT!
    // We don't want might but want yes or no. Since every BBAN is IBAN from the fifth
    // (slice(4)) we can generate the IBAN from BBAN and country code(two first characters)
    // from in the IBAN.
    // To generate the (generate the iban check digits)[generating-iban-check]
    //   Move the country code to the end
    //   remove the checksum from the begging
    //   Add "00" to the end
    //   modulo 97 on the amount
    //   subtract remainder from 98, (98 - remainder)
    //   Add a leading 0 if the remainder is less then 10 (padStart(2, "0")) (we skip this
    //     since we compare int, not string)
    //
    // [validating_iban][https://en.wikipedia.org/wiki/International_Bank_Account_Number#Validating_the_IBAN]
    // [generating-iban-check][https://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits]
    const validationString = replaceCharaterWithCode(`${bban}${countryCode}00`);
    const rest = mod9710(validationString);
    return 98 - rest === providedChecksum;
}
/**
 * Iban contain characters and should be converted to intereger by 55 substracted
 * from there ascii value
 *
 * @ignore
 */
function replaceCharaterWithCode(str) {
    // It is slower but alot more readable
    // https://jsbench.me/ttkzgsekae/1
    return str
        .split('')
        .map((c) => {
        const code = c.charCodeAt(0);
        return code >= 65 ? (code - 55).toString() : c;
    })
        .join('');
}
/**
 * MOD-97-10
 *
 * @ignore
 */
function mod9710Iban(iban) {
    return mod9710(replaceCharaterWithCode(iban.slice(4) + iban.slice(0, 4)));
}
/**
 * Returns specifications for all countries, even those who are not
 * members of IBAN registry. `IBANRegistry` field indicates if country
 * is member of not.
 *
 * ```
 * // Validating IBAN form field after user selects his country
 * // <select id="countries">
 * //   ...
 * //   <option value="NL">Netherlands</option>
 * //   ...
 * // </select>
 * $("#countries").select(function() {
 *   // Find country
 *   let country = ibantools.getCountrySpecifications()[$(this).val()];
 *   // Add country code letters to IBAN form field
 *   $("input#iban").value($(this).val());
 *   // Add New value to "pattern" attribute to #iban input text field
 *   $("input#iban").attr("pattern", $(this).val() + "[0-9]{2}" + country.bban_regexp.slice(1).replace("$",""));
 * });
 * ```
 */
function getCountrySpecifications() {
    const countyMap = {};
    for (const countyCode in exports.countrySpecs) {
        const county = exports.countrySpecs[countyCode];
        countyMap[countyCode] = {
            chars: county.chars || null,
            bban_regexp: county.bban_regexp || null,
            IBANRegistry: county.IBANRegistry || false,
            SEPA: county.SEPA || false,
        };
    }
    return countyMap;
}
/**
 * Validate BIC/SWIFT
 *
 * ```
 * // returns true
 * ibantools.isValidBIC("ABNANL2A");
 *
 * // returns true
 * ibantools.isValidBIC("NEDSZAJJXXX");
 *
 * // returns false
 * ibantools.isValidBIC("ABN4NL2A");
 *
 * // returns false
 * ibantools.isValidBIC("ABNA NL 2A");
 * ```
 */
function isValidBIC(bic) {
    if (!bic) {
        return false;
    }
    const reg = new RegExp('^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$', '');
    const spec = exports.countrySpecs[bic.toUpperCase().slice(4, 6)];
    return reg.test(bic) && spec !== undefined;
}
/**
 * BIC validation errors
 */
var ValidationErrorsBIC;
(function (ValidationErrorsBIC) {
    ValidationErrorsBIC[ValidationErrorsBIC["NoBICProvided"] = 0] = "NoBICProvided";
    ValidationErrorsBIC[ValidationErrorsBIC["NoBICCountry"] = 1] = "NoBICCountry";
    ValidationErrorsBIC[ValidationErrorsBIC["WrongBICFormat"] = 2] = "WrongBICFormat";
})(ValidationErrorsBIC || (exports.ValidationErrorsBIC = ValidationErrorsBIC = {}));
/**
 * validateBIC
 * ```
 * // returns {errorCodes: [], valid: true}
 * ibantools.validateBIC("NEDSZAJJXXX");
 * ```
 */
function validateBIC(bic) {
    const result = { errorCodes: [], valid: true };
    if (bic !== undefined && bic !== null && bic !== '') {
        const spec = exports.countrySpecs[bic.toUpperCase().slice(4, 6)];
        if (spec === undefined) {
            result.valid = false;
            result.errorCodes.push(ValidationErrorsBIC.NoBICCountry);
        }
        else {
            const reg = new RegExp('^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$', '');
            if (!reg.test(bic)) {
                result.valid = false;
                result.errorCodes.push(ValidationErrorsBIC.WrongBICFormat);
            }
        }
    }
    else {
        result.valid = false;
        result.errorCodes.push(ValidationErrorsBIC.NoBICProvided);
    }
    return result;
}
/**
 * extractBIC
 * ```
 * // returns {bankCode: "ABNA", countryCode: "NL", locationCode: "2A", branchCode: null, testBIC: false, valid: true}
 * ibantools.extractBIC("ABNANL2A");
 * ```
 */
function extractBIC(inputBic) {
    const result = {};
    const bic = inputBic.toUpperCase();
    if (isValidBIC(bic)) {
        result.bankCode = bic.slice(0, 4);
        result.countryCode = bic.slice(4, 6);
        result.locationCode = bic.slice(6, 8);
        result.testBIC = result.locationCode[1] === '0' ? true : false;
        result.branchCode = bic.length > 8 ? bic.slice(8) : null;
        result.valid = true;
    }
    else {
        result.valid = false;
    }
    return result;
}
/**
 * Used for Norway BBAN check
 *
 * @ignore
 */
const checkNorwayBBAN = (bban) => {
    const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    const bbanWithoutSpacesAndPeriods = bban.replace(/[\s.]+/g, '');
    const controlDigit = parseInt(bbanWithoutSpacesAndPeriods.charAt(10), 10);
    const bbanWithoutControlDigit = bbanWithoutSpacesAndPeriods.substring(0, 10);
    let sum = 0;
    for (let index = 0; index < 10; index++) {
        sum += parseInt(bbanWithoutControlDigit.charAt(index), 10) * weights[index];
    }
    const remainder = sum % 11;
    return controlDigit === (remainder === 0 ? 0 : 11 - remainder);
};
/**
 * Used for Belgian BBAN check
 *
 * @ignore
 */
const checkBelgianBBAN = (bban) => {
    const stripped = bban.replace(/[\s.]+/g, '');
    const checkingPart = parseInt(stripped.substring(0, stripped.length - 2), 10);
    const checksum = parseInt(stripped.substring(stripped.length - 2, stripped.length), 10);
    const remainder = checkingPart % 97 === 0 ? 97 : checkingPart % 97;
    return remainder === checksum;
};
/**
 * Mod 97/10 calculation
 *
 * @ignore
 */
const mod9710 = (validationString) => {
    while (validationString.length > 2) {
        // > Any computer programming language or software package that is used to compute D
        // > mod 97 directly must have the ability to handle integers of more than 30 digits.
        // > In practice, this can only be done by software that either supports
        // > arbitrary-precision arithmetic or that can handle 219-bit (unsigned) integers
        // https://en.wikipedia.org/wiki/International_Bank_Account_Number#Modulo_operation_on_IBAN
        const part = validationString.slice(0, 6);
        const partInt = parseInt(part, 10);
        if (isNaN(partInt)) {
            return NaN;
        }
        validationString = (partInt % 97) + validationString.slice(part.length);
    }
    return parseInt(validationString, 10) % 97;
};
/**
 * Check BBAN based on Mod97/10 calculation for countries that support it:
 * BA, ME, MK, PT, RS, SI
 *
 * @ignore
 */
const checkMod9710BBAN = (bban) => {
    const stripped = bban.replace(/[\s.]+/g, '');
    const reminder = mod9710(stripped);
    return reminder === 1;
};
/**
 * Used for Poland BBAN check
 *
 * @ignore
 */
const checkPolandBBAN = (bban) => {
    const weights = [3, 9, 7, 1, 3, 9, 7];
    const controlDigit = parseInt(bban.charAt(7), 10);
    const toCheck = bban.substring(0, 7);
    let sum = 0;
    for (let index = 0; index < 7; index++) {
        sum += parseInt(toCheck.charAt(index), 10) * weights[index];
    }
    const remainder = sum % 10;
    return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
};
/**
 * Spain (ES) BBAN check
 *
 * @ignore
 */
const checkSpainBBAN = (bban) => {
    const weightsBankBranch = [4, 8, 5, 10, 9, 7, 3, 6];
    const weightsAccount = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
    const controlBankBranch = parseInt(bban.charAt(8), 10);
    const controlAccount = parseInt(bban.charAt(9), 10);
    const bankBranch = bban.substring(0, 8);
    const account = bban.substring(10, 20);
    let sum = 0;
    for (let index = 0; index < 8; index++) {
        sum += parseInt(bankBranch.charAt(index), 10) * weightsBankBranch[index];
    }
    let remainder = sum % 11;
    if (controlBankBranch !== (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder)) {
        return false;
    }
    sum = 0;
    for (let index = 0; index < 10; index++) {
        sum += parseInt(account.charAt(index), 10) * weightsAccount[index];
    }
    remainder = sum % 11;
    return controlAccount === (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder);
};
/**
 * Mod 11/10 check
 *
 * @ignore
 */
const checkMod1110 = (toCheck, control) => {
    let nr = 10;
    for (let index = 0; index < toCheck.length; index++) {
        nr += parseInt(toCheck.charAt(index), 10);
        if (nr % 10 !== 0) {
            nr = nr % 10;
        }
        nr = nr * 2;
        nr = nr % 11;
    }
    return control === (11 - nr === 10 ? 0 : 11 - nr);
};
/**
 * Croatian (HR) BBAN check
 *
 * @ignore
 */
const checkCroatianBBAN = (bban) => {
    const controlBankBranch = parseInt(bban.charAt(6), 10);
    const controlAccount = parseInt(bban.charAt(16), 10);
    const bankBranch = bban.substring(0, 6);
    const account = bban.substring(7, 16);
    return checkMod1110(bankBranch, controlBankBranch) && checkMod1110(account, controlAccount);
};
/**
 * Czech (CZ) and Slowak (SK) BBAN check
 *
 * @ignore
 */
const checkCzechAndSlovakBBAN = (bban) => {
    const weightsPrefix = [10, 5, 8, 4, 2, 1];
    const weightsSuffix = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    const controlPrefix = parseInt(bban.charAt(9), 10);
    const controlSuffix = parseInt(bban.charAt(19), 10);
    const prefix = bban.substring(4, 9);
    const suffix = bban.substring(10, 19);
    let sum = 0;
    for (let index = 0; index < prefix.length; index++) {
        sum += parseInt(prefix.charAt(index), 10) * weightsPrefix[index];
    }
    let remainder = sum % 11;
    if (controlPrefix !== (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder)) {
        return false;
    }
    sum = 0;
    for (let index = 0; index < suffix.length; index++) {
        sum += parseInt(suffix.charAt(index), 10) * weightsSuffix[index];
    }
    remainder = sum % 11;
    return controlSuffix === (remainder === 0 ? 0 : remainder === 1 ? 1 : 11 - remainder);
};
/**
 * Estonian (EE) BBAN check
 *
 * @ignore
 */
const checkEstonianBBAN = (bban) => {
    const weights = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    const controlDigit = parseInt(bban.charAt(15), 10);
    const toCheck = bban.substring(2, 15);
    let sum = 0;
    for (let index = 0; index < toCheck.length; index++) {
        sum += parseInt(toCheck.charAt(index), 10) * weights[index];
    }
    const remainder = sum % 10;
    return controlDigit === (remainder === 0 ? 0 : 10 - remainder);
};
/**
 * Check French (FR) BBAN
 * Also for Monaco (MC)
 *
 * @ignore
 */
const checkFrenchBBAN = (bban) => {
    const stripped = bban.replace(/[\s.]+/g, '');
    const normalized = Array.from(stripped);
    for (let index = 0; index < stripped.length; index++) {
        const c = normalized[index].charCodeAt(0);
        if (c >= 65) {
            switch (c) {
                case 65:
                case 74:
                    normalized[index] = '1';
                    break;
                case 66:
                case 75:
                case 83:
                    normalized[index] = '2';
                    break;
                case 67:
                case 76:
                case 84:
                    normalized[index] = '3';
                    break;
                case 68:
                case 77:
                case 85:
                    normalized[index] = '4';
                    break;
                case 69:
                case 78:
                case 86:
                    normalized[index] = '5';
                    break;
                case 70:
                case 79:
                case 87:
                    normalized[index] = '6';
                    break;
                case 71:
                case 80:
                case 88:
                    normalized[index] = '7';
                    break;
                case 72:
                case 81:
                case 89:
                    normalized[index] = '8';
                    break;
                case 73:
                case 82:
                case 90:
                    normalized[index] = '9';
                    break;
            }
        }
    }
    const remainder = mod9710(normalized.join(''));
    return remainder === 0;
};
/**
 * Hungarian (HU) BBAN check
 *
 * @ignore
 */
const checkHungarianBBAN = (bban) => {
    const weights = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3, 1, 9, 7, 3];
    const controlDigitBankBranch = parseInt(bban.charAt(7), 10);
    const toCheckBankBranch = bban.substring(0, 7);
    let sum = 0;
    for (let index = 0; index < toCheckBankBranch.length; index++) {
        sum += parseInt(toCheckBankBranch.charAt(index), 10) * weights[index];
    }
    const remainder = sum % 10;
    if (controlDigitBankBranch !== (remainder === 0 ? 0 : 10 - remainder)) {
        return false;
    }
    sum = 0;
    if (bban.endsWith('00000000')) {
        const toCheckAccount = bban.substring(8, 15);
        const controlDigitAccount = parseInt(bban.charAt(15), 10);
        for (let index = 0; index < toCheckAccount.length; index++) {
            sum += parseInt(toCheckAccount.charAt(index), 10) * weights[index];
        }
        const remainder = sum % 10;
        return controlDigitAccount === (remainder === 0 ? 0 : 10 - remainder);
    }
    else {
        const toCheckAccount = bban.substring(8, 23);
        const controlDigitAccount = parseInt(bban.charAt(23), 10);
        for (let index = 0; index < toCheckAccount.length; index++) {
            sum += parseInt(toCheckAccount.charAt(index), 10) * weights[index];
        }
        const remainder = sum % 10;
        return controlDigitAccount === (remainder === 0 ? 0 : 10 - remainder);
    }
};
/**
 * Set custom BBAN validation function for country.
 *
 * If `bban_validation_func` already exists for the corresponding country,
 * it will be overwritten.
 */
const setCountryBBANValidation = (country, func) => {
    if (typeof exports.countrySpecs[country] === 'undefined') {
        return false;
    }
    exports.countrySpecs[country].bban_validation_func = func;
    return true;
};
exports.setCountryBBANValidation = setCountryBBANValidation;
/**
 * Country specifications
 */
exports.countrySpecs = {
    AD: {
        chars: 24,
        bban_regexp: '^[0-9]{8}[A-Z0-9]{12}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-7',
        bank_identifier: '0-3',
        account_indentifier: '12-23',
    },
    AE: {
        chars: 23,
        bban_regexp: '^[0-9]{3}[0-9]{16}$',
        IBANRegistry: true,
        bank_identifier: '0-2',
        account_indentifier: '7-23',
    },
    AF: {},
    AG: {},
    AI: {},
    AL: {
        chars: 28,
        bban_regexp: '^[0-9]{8}[A-Z0-9]{16}$',
        IBANRegistry: true,
        branch_indentifier: '3-7',
        bank_identifier: '0-2',
        account_indentifier: '12-28',
    },
    AM: {},
    AO: {
        chars: 25,
        bban_regexp: '^[0-9]{21}$',
    },
    AQ: {},
    AR: {},
    AS: {},
    AT: { chars: 20, bban_regexp: '^[0-9]{16}$', IBANRegistry: true, SEPA: true, bank_identifier: '0-4' },
    AU: {},
    AW: {},
    AX: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
    },
    AZ: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{20}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '4-28',
    },
    BA: {
        chars: 20,
        bban_regexp: '^[0-9]{16}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        branch_indentifier: '3-5',
        bank_identifier: '0-2',
    },
    BB: {},
    BD: {},
    BE: {
        chars: 16,
        bban_regexp: '^[0-9]{12}$',
        bban_validation_func: checkBelgianBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-2',
        account_indentifier: '0-16',
    },
    BF: {
        chars: 28,
        bban_regexp: '^[A-Z0-9]{2}[0-9]{22}$',
    },
    BG: {
        chars: 22,
        bban_regexp: '^[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-7',
        bank_identifier: '0-3',
    },
    BH: {
        chars: 22,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{14}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-22',
    },
    BI: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
        branch_indentifier: '5-9',
        bank_identifier: '0-4',
        account_indentifier: '14-27',
    },
    BJ: {
        chars: 28,
        bban_regexp: '^[A-Z0-9]{2}[0-9]{22}$',
    },
    BL: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
    },
    BM: {},
    BN: {},
    BO: {},
    BQ: {},
    BR: {
        chars: 29,
        bban_regexp: '^[0-9]{23}[A-Z]{1}[A-Z0-9]{1}$',
        IBANRegistry: true,
        branch_indentifier: '8-12',
        bank_identifier: '0-7',
        account_indentifier: '17-29',
    },
    BS: {},
    BT: {},
    BV: {},
    BW: {},
    BY: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[0-9]{4}[A-Z0-9]{16}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
    },
    BZ: {},
    CA: {},
    CC: {},
    CD: {},
    CF: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    CG: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    CH: {
        chars: 21,
        bban_regexp: '^[0-9]{5}[A-Z0-9]{12}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-4',
    },
    CI: {
        chars: 28,
        bban_regexp: '^[A-Z]{1}[0-9]{23}$',
    },
    CK: {},
    CL: {},
    CM: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    CN: {},
    CO: {},
    CR: {
        chars: 22,
        bban_regexp: '^[0-9]{18}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-22',
    },
    CU: {},
    CV: { chars: 25, bban_regexp: '^[0-9]{21}$' },
    CW: {},
    CX: {},
    CY: {
        chars: 28,
        bban_regexp: '^[0-9]{8}[A-Z0-9]{16}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '3-7',
        bank_identifier: '0-2',
        account_indentifier: '12-28',
    },
    CZ: {
        chars: 24,
        bban_regexp: '^[0-9]{20}$',
        bban_validation_func: checkCzechAndSlovakBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
    },
    DE: {
        chars: 22,
        bban_regexp: '^[0-9]{18}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-7',
        account_indentifier: '12-22',
    },
    DJ: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
        branch_indentifier: '5-9',
        bank_identifier: '0-4',
        account_indentifier: '14-27',
    },
    DK: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '4-18',
    },
    DM: {},
    DO: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[0-9]{20}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-28',
    },
    DZ: {
        chars: 26,
        bban_regexp: '^[0-9]{22}$',
    },
    EC: {},
    EE: {
        chars: 20,
        bban_regexp: '^[0-9]{16}$',
        bban_validation_func: checkEstonianBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-1',
        account_indentifier: '8-20',
    },
    EG: {
        chars: 29,
        bban_regexp: '^[0-9]{25}',
        IBANRegistry: true,
        branch_indentifier: '4-7',
        bank_identifier: '0-3',
        account_indentifier: '17-29',
    },
    EH: {},
    ER: {},
    ES: {
        chars: 24,
        bban_validation_func: checkSpainBBAN,
        bban_regexp: '^[0-9]{20}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-7',
        bank_identifier: '0-3',
        account_indentifier: '14-24',
    },
    ET: {},
    FI: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-2',
        account_indentifier: '0-0',
    },
    FJ: {},
    FK: {
        chars: 18,
        bban_regexp: '^[A-Z]{2}[0-9]{12}$',
        bank_identifier: '0-1',
        account_indentifier: '6-18',
    },
    FM: {},
    FO: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '4-18',
    },
    FR: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        bban_validation_func: checkFrenchBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-4',
        branch_indentifier: '5-9',
        account_indentifier: '14-24',
    },
    GA: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    GB: {
        chars: 22,
        bban_regexp: '^[A-Z]{4}[0-9]{14}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-9',
        bank_identifier: '0-3',
    },
    GD: {},
    GE: {
        chars: 22,
        bban_regexp: '^[A-Z0-9]{2}[0-9]{16}$',
        IBANRegistry: true,
        bank_identifier: '0-1',
        account_indentifier: '6-22',
    },
    GF: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    GG: {},
    GH: {},
    GI: {
        chars: 23,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{15}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '8-23',
    },
    GL: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '4-18',
    },
    GM: {},
    GN: {},
    GP: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    GQ: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    GR: {
        chars: 27,
        bban_regexp: '^[0-9]{7}[A-Z0-9]{16}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '3-6',
        bank_identifier: '0-2',
        account_indentifier: '7-27',
    },
    GS: {},
    GT: {
        chars: 28,
        bban_regexp: '^[A-Z0-9]{24}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-28',
    },
    GU: {},
    GW: {
        chars: 25,
        bban_regexp: '^[A-Z]{2}[0-9]{19}$',
    },
    GY: {},
    HK: {},
    HM: {},
    HN: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[0-9]{20}$',
    },
    HR: {
        chars: 21,
        bban_regexp: '^[0-9]{17}$',
        bban_validation_func: checkCroatianBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-6',
    },
    HT: {},
    HU: {
        chars: 28,
        bban_regexp: '^[0-9]{24}$',
        bban_validation_func: checkHungarianBBAN,
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '3-6',
        bank_identifier: '0-2',
    },
    ID: {},
    IE: {
        chars: 22,
        bban_regexp: '^[A-Z0-9]{4}[0-9]{14}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-9',
        bank_identifier: '0-3',
    },
    IL: {
        chars: 23,
        bban_regexp: '^[0-9]{19}$',
        IBANRegistry: true,
        branch_indentifier: '3-5',
        bank_identifier: '0-2',
    },
    IM: {},
    IN: {},
    IO: {},
    IQ: {
        chars: 23,
        bban_regexp: '^[A-Z]{4}[0-9]{15}$',
        IBANRegistry: true,
        branch_indentifier: '4-6',
        bank_identifier: '0-3',
        account_indentifier: '11-23',
    },
    IR: {
        chars: 26,
        bban_regexp: '^[0-9]{22}$',
    },
    IS: {
        chars: 26,
        bban_regexp: '^[0-9]{22}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '2-3',
        bank_identifier: '0-1',
        account_indentifier: '8-25'
    },
    IT: {
        chars: 27,
        bban_regexp: '^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '6-10',
        bank_identifier: '1-5',
        account_indentifier: '4-27',
    },
    JE: {},
    JM: {},
    JO: {
        chars: 30,
        bban_regexp: '^[A-Z]{4}[0-9]{4}[A-Z0-9]{18}$',
        IBANRegistry: true,
        branch_indentifier: '4-7',
        bank_identifier: '4-7',
    },
    JP: {},
    KE: {},
    KG: {},
    KH: {},
    KI: {},
    KM: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    KN: {},
    KP: {},
    KR: {},
    KW: {
        chars: 30,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{22}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '20-30',
    },
    KY: {},
    KZ: {
        chars: 20,
        bban_regexp: '^[0-9]{3}[A-Z0-9]{13}$',
        IBANRegistry: true,
        bank_identifier: '0-2',
        account_indentifier: '0-20',
    },
    LA: {},
    LB: {
        chars: 28,
        bban_regexp: '^[0-9]{4}[A-Z0-9]{20}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '14-28',
    },
    LC: {
        chars: 32,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{24}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-32',
    },
    LI: {
        chars: 21,
        bban_regexp: '^[0-9]{5}[A-Z0-9]{12}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-4',
    },
    LK: {},
    LR: {},
    LS: {},
    LT: { chars: 20, bban_regexp: '^[0-9]{16}$', IBANRegistry: true, SEPA: true, bank_identifier: '0-4' },
    LU: {
        chars: 20,
        bban_regexp: '^[0-9]{3}[A-Z0-9]{13}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-2',
    },
    LV: {
        chars: 21,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{13}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '0-21',
    },
    LY: {
        chars: 25,
        bban_regexp: '^[0-9]{21}$',
        IBANRegistry: true,
        branch_indentifier: '3-5',
        bank_identifier: '0-2',
        account_indentifier: '10-25',
    },
    MA: {
        chars: 28,
        bban_regexp: '^[0-9]{24}$',
    },
    MC: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        bban_validation_func: checkFrenchBBAN,
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '5-9',
        bank_identifier: '0-4',
    },
    MD: {
        chars: 24,
        bban_regexp: '^[A-Z0-9]{2}[A-Z0-9]{18}$',
        IBANRegistry: true,
        bank_identifier: '0-1',
        account_indentifier: '6-24',
    },
    ME: {
        chars: 22,
        bban_regexp: '^[0-9]{18}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        bank_identifier: '0-2',
        account_indentifier: '4-22',
    },
    MF: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    MG: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    MH: {},
    MK: {
        chars: 19,
        bban_regexp: '^[0-9]{3}[A-Z0-9]{10}[0-9]{2}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        bank_identifier: '0-2',
    },
    ML: {
        chars: 28,
        bban_regexp: '^[A-Z0-9]{2}[0-9]{22}$',
    },
    MM: {},
    MN: {
        chars: 20,
        bban_regexp: '^[0-9]{16}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-20',
    },
    MO: {},
    MP: {},
    MQ: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    MR: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
        IBANRegistry: true,
        branch_indentifier: '5-9',
        bank_identifier: '0-4',
        account_indentifier: '8-26',
    },
    MS: {},
    MT: {
        chars: 31,
        bban_regexp: '^[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '4-8',
        bank_identifier: '0-3',
        account_indentifier: '15-31',
    },
    MU: {
        chars: 30,
        bban_regexp: '^[A-Z]{4}[0-9]{19}[A-Z]{3}$',
        IBANRegistry: true,
        branch_indentifier: '6-7',
        bank_identifier: '0-5',
        account_indentifier: '0-30',
    },
    MV: {},
    MW: {},
    MX: {},
    MY: {},
    MZ: {
        chars: 25,
        bban_regexp: '^[0-9]{21}$',
    },
    NA: {},
    NC: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    NE: {
        chars: 28,
        bban_regexp: '^[A-Z]{2}[0-9]{22}$',
    },
    NF: {},
    NG: {},
    NI: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[0-9]{20}$',
        bank_identifier: '0-3',
        IBANRegistry: true,
        account_indentifier: '8-28',
    },
    NL: {
        chars: 18,
        bban_regexp: '^[A-Z]{4}[0-9]{10}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '8-18',
    },
    NO: {
        chars: 15,
        bban_regexp: '^[0-9]{11}$',
        bban_validation_func: checkNorwayBBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '4-15',
    },
    NP: {},
    NR: {},
    NU: {},
    NZ: {},
    OM: {
        chars: 23,
        bban_regexp: '^[0-9]{3}[A-Z0-9]{16}$',
        IBANRegistry: true,
        SEPA: false,
        bank_identifier: '0-2',
    },
    PA: {},
    PE: {},
    PF: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    PG: {},
    PH: {},
    PK: {
        chars: 24,
        bban_regexp: '^[A-Z0-9]{4}[0-9]{16}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
    },
    PL: {
        chars: 28,
        bban_validation_func: checkPolandBBAN,
        bban_regexp: '^[0-9]{24}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '0-7',
        account_indentifier: '2-28',
    },
    PM: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    PN: {},
    PR: {},
    PS: {
        chars: 29,
        bban_regexp: '^[A-Z0-9]{4}[0-9]{21}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '17-29',
    },
    PT: {
        chars: 25,
        bban_regexp: '^[0-9]{21}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
    },
    PW: {},
    PY: {},
    QA: {
        chars: 29,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{21}$',
        IBANRegistry: true,
        bank_identifier: '0-3',
        account_indentifier: '8-29',
    },
    RE: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    RO: {
        chars: 24,
        bban_regexp: '^[A-Z]{4}[A-Z0-9]{16}$',
        IBANRegistry: true,
        SEPA: true,
        bank_identifier: '0-3',
        account_indentifier: '0-24',
    },
    RS: {
        chars: 22,
        bban_regexp: '^[0-9]{18}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        bank_identifier: '0-2',
    },
    RU: {
        chars: 33,
        bban_regexp: '^[0-9]{14}[A-Z0-9]{15}$',
        IBANRegistry: true,
        branch_indentifier: '9-13',
        bank_identifier: '0-8',
        account_indentifier: '13-33',
    },
    RW: {},
    SA: {
        chars: 24,
        bban_regexp: '^[0-9]{2}[A-Z0-9]{18}$',
        IBANRegistry: true,
        bank_identifier: '0-1',
        account_indentifier: '12-24',
    },
    SB: {},
    SC: {
        chars: 31,
        bban_regexp: '^[A-Z]{4}[0-9]{20}[A-Z]{3}$',
        IBANRegistry: true,
        branch_indentifier: '6-7',
        bank_identifier: '0-5',
        account_indentifier: '12-28',
    },
    SD: {
        chars: 18,
        bban_regexp: '^[0-9]{14}$',
        IBANRegistry: true,
        bank_identifier: '0-1',
        account_indentifier: '6-18',
    },
    SE: { chars: 24, bban_regexp: '^[0-9]{20}$', IBANRegistry: true, SEPA: true, bank_identifier: '0-2' },
    SG: {},
    SH: {},
    SI: {
        chars: 19,
        bban_regexp: '^[0-9]{15}$',
        bban_validation_func: checkMod9710BBAN,
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '2-4',
        bank_identifier: '0-1',
        account_indentifier: '9-16',
    },
    SJ: {},
    SK: {
        chars: 24,
        bban_regexp: '^[0-9]{20}$',
        bban_validation_func: checkCzechAndSlovakBBAN,
        IBANRegistry: true,
        SEPA: true,
    },
    SL: {},
    SM: {
        chars: 27,
        bban_regexp: '^[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$',
        IBANRegistry: true,
        SEPA: true,
        branch_indentifier: '6-10',
    },
    SN: {
        chars: 28,
        bban_regexp: '^[A-Z]{2}[0-9]{22}$',
    },
    SO: {
        chars: 23,
        bban_regexp: '^[0-9]{19}$',
        IBANRegistry: true,
        branch_indentifier: '4-6',
        account_indentifier: '11-23',
    },
    SR: {},
    SS: {},
    ST: {
        chars: 25,
        bban_regexp: '^[0-9]{21}$',
        IBANRegistry: true,
        branch_indentifier: '4-7',
    },
    SV: {
        chars: 28,
        bban_regexp: '^[A-Z]{4}[0-9]{20}$',
        IBANRegistry: true,
        account_indentifier: '8-28',
    },
    SX: {},
    SY: {},
    SZ: {},
    TC: {},
    TD: {
        chars: 27,
        bban_regexp: '^[0-9]{23}$',
    },
    TF: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    TG: {
        chars: 28,
        bban_regexp: '^[A-Z]{2}[0-9]{22}$',
    },
    TH: {},
    TJ: {},
    TK: {},
    TL: {
        chars: 23,
        bban_regexp: '^[0-9]{19}$',
        IBANRegistry: true,
        account_indentifier: '4-23',
    },
    TM: {},
    TN: {
        chars: 24,
        bban_regexp: '^[0-9]{20}$',
        IBANRegistry: true,
        branch_indentifier: '2-4',
        account_indentifier: '4-24',
    },
    TO: {},
    TR: {
        chars: 26,
        bban_regexp: '^[0-9]{5}[A-Z0-9]{17}$',
        IBANRegistry: true,
    },
    TT: {},
    TV: {},
    TW: {},
    TZ: {},
    UA: {
        chars: 29,
        bban_regexp: '^[0-9]{6}[A-Z0-9]{19}$',
        IBANRegistry: true,
        account_indentifier: '15-29',
    },
    UG: {},
    UM: {},
    US: {},
    UY: {},
    UZ: {},
    VA: {
        chars: 22,
        bban_regexp: '^[0-9]{18}',
        IBANRegistry: true,
        SEPA: true,
        account_indentifier: '7-22',
    },
    VC: {},
    VE: {},
    VG: {
        chars: 24,
        bban_regexp: '^[A-Z0-9]{4}[0-9]{16}$',
        IBANRegistry: true,
        account_indentifier: '8-24',
    },
    VI: {},
    VN: {},
    VU: {},
    WF: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    WS: {},
    XK: {
        chars: 20,
        bban_regexp: '^[0-9]{16}$',
        IBANRegistry: true,
        branch_indentifier: '2-3',
        account_indentifier: '4-20',
    },
    YE: {
        chars: 30,
        bban_regexp: '[A-Z]{4}[0-9]{4}[0-9A-Z]{18}',
        IBANRegistry: true,
        bank_identifier: '0-3',
        branch_indentifier: '4-7',
    },
    YT: {
        chars: 27,
        bban_regexp: '^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$',
        IBANRegistry: true,
    },
    ZA: {},
    ZM: {},
    ZW: {},
};
