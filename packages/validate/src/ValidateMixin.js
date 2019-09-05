/* eslint-disable class-methods-use-this, camelcase, no-param-reassign */

import { dedupeMixin, SlotMixin } from '@lion/core';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { localize, LocalizeMixin } from '@lion/localize';
import { Unparseable } from './Unparseable.js';
import { randomOk } from './validators.js';

import { Validator } from './Validator.js';

// TODO: extract from module like import { pascalCase } from 'lion-element/CaseMapUtils.js'
const pascalCase = str => str.charAt(0).toUpperCase() + str.slice(1);

/* @polymerMixin */

export const ValidateMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow, max-len
    class ValidateMixin extends ObserverMixin(LocalizeMixin(SlotMixin(superclass))) {
      /* * * * * * * * * *
    Configuration  */

      get slots() {
        return {
          ...super.slots,
          feedback: () => document.createElement('div'),
        };
      }

      static get localizeNamespaces() {
        return [
          {
            /* FIXME: This awful switch statement is used to make sure it works with polymer build.. */
            'lion-validate': locale => {
              switch (locale) {
                case 'bg-BG':
                  return import('../translations/bg-BG.js');
                case 'bg':
                  return import('../translations/bg.js');
                case 'cs-CZ':
                  return import('../translations/cs-CZ.js');
                case 'cs':
                  return import('../translations/cs.js');
                case 'de-DE':
                  return import('../translations/de-DE.js');
                case 'de':
                  return import('../translations/de.js');
                case 'en-AU':
                  return import('../translations/en-AU.js');
                case 'en-GB':
                  return import('../translations/en-GB.js');
                case 'en-US':
                  return import('../translations/en-US.js');
                case 'en-PH':
                case 'en':
                  return import('../translations/en.js');
                case 'es-ES':
                  return import('../translations/es-ES.js');
                case 'es':
                  return import('../translations/es.js');
                case 'fr-FR':
                  return import('../translations/fr-FR.js');
                case 'fr-BE':
                  return import('../translations/fr-BE.js');
                case 'fr':
                  return import('../translations/fr.js');
                case 'hu-HU':
                  return import('../translations/hu-HU.js');
                case 'hu':
                  return import('../translations/hu.js');
                case 'it-IT':
                  return import('../translations/it-IT.js');
                case 'it':
                  return import('../translations/it.js');
                case 'nl-BE':
                  return import('../translations/nl-BE.js');
                case 'nl-NL':
                  return import('../translations/nl-NL.js');
                case 'nl':
                  return import('../translations/nl.js');
                case 'pl-PL':
                  return import('../translations/pl-PL.js');
                case 'pl':
                  return import('../translations/pl.js');
                case 'ro-RO':
                  return import('../translations/ro-RO.js');
                case 'ro':
                  return import('../translations/ro.js');
                case 'ru-RU':
                  return import('../translations/ru-RU.js');
                case 'ru':
                  return import('../translations/ru.js');
                case 'sk-SK':
                  return import('../translations/sk-SK.js');
                case 'sk':
                  return import('../translations/sk.js');
                case 'uk-UA':
                  return import('../translations/uk-UA.js');
                case 'uk':
                  return import('../translations/uk.js');
                case 'zh-CN':
                case 'zh':
                  return import('../translations/zh.js');
                default:
                  return import(`../translations/${locale}.js`);
              }
            },
          },
          ...super.localizeNamespaces,
        ];
      }

      static get properties() {
        return {
          /**
           * List of validators that should set the input to invalid
           */
          errorValidators: {
            type: Array,
          },
          error: {
            type: Object,
          },
          errorState: {
            type: Boolean,
            attribute: 'error-state',
            reflect: true,
          },
          errorShow: {
            type: Boolean,
            attribute: 'error-show',
            reflect: true,
          },
          warningValidators: {
            type: Object,
          },
          warning: {
            type: Object,
          },
          warningState: {
            type: Boolean,
            attribute: 'warning-state',
            reflect: true,
          },
          warningShow: {
            type: Boolean,
            attribute: 'warning-show',
            reflect: true,
          },
          infoValidators: {
            type: Object,
          },
          info: {
            type: Object,
          },
          infoState: {
            type: Boolean,
            attribute: 'info-state',
            reflect: true,
          },
          infoShow: {
            type: Boolean,
            attribute: 'info-show',
            reflect: true,
          },
          successValidators: {
            type: Object,
          },
          success: {
            type: Object,
          },
          successState: {
            type: Boolean,
            attribute: 'success-state',
            reflect: true,
          },
          successShow: {
            type: Boolean,
            attribute: 'success-show',
            reflect: true,
          },
          invalid: {
            type: Boolean,
            reflect: true,
          },
          message: {
            type: Boolean,
          },
          defaultSuccessFeedback: {
            type: Boolean,
          },
          /**
           * The currently displayed message(s)
           */
          _validationMessage: {
            type: String,
          },
        };
      }

      static get asyncObservers() {
        return {
          ...super.asyncObservers,
          // TODO: consider adding 'touched', 'dirty', 'submitted', 'prefilled' on LionFieldFundament
          // level, since ValidateMixin doesn't have a direct dependency on interactionState
          _createMessageAndRenderFeedback: [
            'error',
            'warning',
            'info',
            'success',
            'touched',
            'dirty',
            'submitted',
            'prefilled',
            'label',
          ],
          _onErrorShowChangedAsync: ['errorShow'],
        };
      }

      static get syncObservers() {
        return {
          ...super.syncObservers,
          validate: [
            'errorValidators',
            'warningValidators',
            'infoValidators',
            'successValidators',
            'modelValue',
          ],
          _onErrorChanged: ['error'],
          _onWarningChanged: ['warning'],
          _onInfoChanged: ['info'],
          _onSuccessChanged: ['success'],
          _onErrorStateChanged: ['errorState'],
          _onWarningStateChanged: ['warningState'],
          _onInfoStateChanged: ['infoState'],
          _onSuccessStateChanged: ['successState'],
        };
      }

      static get validationTypes() {
        return ['error', 'warning', 'info', 'success'];
      }

      get _feedbackElement() {
        return (this.$$slot && this.$$slot('feedback')) || this.querySelector('[slot="feedback"]');
      }

      updated(changedProperties) {
        super.updated(changedProperties);

        // @deprecated adding css classes for backwards compatibility
        this.constructor.validationTypes.forEach(name => {
          if (changedProperties.has(`${name}State`)) {
            this.classList[this[`${name}State`] ? 'add' : 'remove'](`state-${name}`);
          }
          if (changedProperties.has(`${name}Show`)) {
            this.classList[this[`${name}Show`] ? 'add' : 'remove'](`state-${name}-show`);
          }
        });
        if (changedProperties.has('invalid')) {
          this.classList[this.invalid ? 'add' : 'remove'](`state-invalid`);
        }
      }

      getFieldName(validatorParams) {
        const label =
          this.label || (this.$$slot && this.$$slot('label') && this.$$slot('label').textContent);

        if (validatorParams && validatorParams.fieldName) {
          return validatorParams.fieldName;
        }
        if (label) {
          return label;
        }
        return this.name;
      }

      _onErrorStateChanged() {
        this.dispatchEvent(
          new CustomEvent('error-state-changed', { bubbles: true, composed: true }),
        );
      }

      _onWarningStateChanged() {
        this.dispatchEvent(
          new CustomEvent('warning-state-changed', { bubbles: true, composed: true }),
        );
      }

      _onInfoStateChanged() {
        this.dispatchEvent(
          new CustomEvent('info-state-changed', { bubbles: true, composed: true }),
        );
      }

      _onSuccessStateChanged() {
        this.dispatchEvent(
          new CustomEvent('success-state-changed', { bubbles: true, composed: true }),
        );
      }

      /* * * * * * * * * * * *
    Observer Handlers  */

      onLocaleUpdated() {
        if (super.onLocaleUpdated) {
          super.onLocaleUpdated();
        }
        this._createMessageAndRenderFeedback();
      }

      _createMessageAndRenderFeedback() {
        this._createMessage();
        const details = {};

        this.constructor.validationTypes.forEach(type => {
          details[type] = this[type];
        });

        if (this._feedbackElement) {
          // Only write to light DOM not put there by Application Developer, but by <lion-component>
          if (typeof this._feedbackElement.renderFeedback === 'function') {
            this._feedbackElement.renderFeedback(this.getValidationStates(), this.message, details);
          } else {
            this.renderFeedback(this.getValidationStates(), this.message, details);
          }
        }
      }

      _onErrorChanged(newValues, oldValues) {
        if (!this.constructor._objectEquals(newValues.error, oldValues.error)) {
          this.dispatchEvent(new CustomEvent('error-changed', { bubbles: true, composed: true }));
        }
      }

      _onWarningChanged(newValues, oldValues) {
        if (!this.constructor._objectEquals(newValues.warning, oldValues.warning)) {
          this.dispatchEvent(new CustomEvent('warning-changed', { bubbles: true, composed: true }));
        }
      }

      _onInfoChanged(newValues, oldValues) {
        if (!this.constructor._objectEquals(newValues.info, oldValues.info)) {
          this.dispatchEvent(new CustomEvent('info-changed', { bubbles: true, composed: true }));
        }
      }

      _onSuccessChanged(newValues, oldValues) {
        if (!this.constructor._objectEquals(newValues.success, oldValues.success)) {
          this.dispatchEvent(new CustomEvent('success-changed', { bubbles: true, composed: true }));
        }
      }

      _createMessage() {
        const newStates = this.getValidationStates();
        this.message = { list: [], message: '' };
        this.constructor.validationTypes.forEach(type => {
          if (this[`show${pascalCase(type)}Condition`](newStates, this.__oldValidationStates)) {
            this[`${type}Show`] = true;
            this.message.list.push(...this[type].list);
          } else {
            this[`${type}Show`] = false;
          }
        });
        if (this.message.list.length > 0) {
          this.messageState = true;
          const { translationKeys, data } = this.message.list[0];
          data.fieldName = this.getFieldName(data.validatorParams);
          this._validationMessage = this.translateMessage(translationKeys, data);
          this.message.message = this._validationMessage;
        } else {
          this.messageState = false;
          this._validationMessage = '';
          this.message.message = this._validationMessage;
        }
        return this.message.message;
      }

      /**
       * Can be overridden by sub classers
       */
      renderFeedback() {
        if (this._feedbackElement) {
          this._feedbackElement.textContent = this._validationMessage;
        }
      }

      _onErrorShowChangedAsync({ errorShow }) {
        // Screen reader output should be in sync with visibility of error messages
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-invalid', errorShow);
          // TODO: test and see if needed for a11y
          // this.inputElement.setCustomValidity(this._validationMessage || '');
        }
      }

      /* * * * * * * * * *
    Public Methods */

      getValidationStates() {
        const result = {};
        this.constructor.validationTypes.forEach(type => {
          result[type] = this[`${type}State`];
        });
        return result;
      }

      /**
       * Order is: Error, Warning, Info
       * Transition from Error to "nothing" results in success
       * Other transitions (from Warning/Info) are not followed by a success message
       */
      async validate() {
        if (this.modelValue === undefined) {
          this.__resetValidationStates();
          return;
        }
        this.__oldValidationStates = this.getValidationStates();
        this.constructor.validationTypes.forEach(type => {
          this.validateType(type);
        });
        this.dispatchEvent(new CustomEvent('validation-done', { bubbles: true, composed: true }));
      }

      __resetValidationStates() {
        this.constructor.validationTypes.forEach(type => {
          this[`${type}State`] = false;
          this[type] = {};
        });
      }

      /**
       * Override if needed
       */
      translateMessage(keys, data) {
        return localize.msg(keys, data);
      }

      showErrorCondition(newStates) {
        return newStates.error;
      }

      showWarningCondition(newStates) {
        return newStates.warning && !newStates.error;
      }

      showInfoCondition(newStates) {
        return newStates.info && !newStates.error && !newStates.warning;
      }

      showSuccessCondition(newStates, oldStates) {
        return (
          newStates.success &&
          !newStates.error &&
          !newStates.warning &&
          !newStates.info &&
          oldStates.error
        );
      }

      getErrorTranslationsKeys(data) {
        return this.constructor.__getLocalizeKeys(
          `error.${data.validatorName}`,
          data.validatorName,
        );
      }

      getWarningTranslationsKeys(data) {
        return this.constructor.__getLocalizeKeys(
          `warning.${data.validatorName}`,
          data.validatorName,
        );
      }

      getInfoTranslationsKeys(data) {
        return this.constructor.__getLocalizeKeys(`info.${data.validatorName}`, data.validatorName);
      }

      /**
       * Special case for ok validators starting with 'random'. Example for randomOk:
       *   - will fetch translation for randomOk (should contain multiple translations keys)
       *   - split by ',' and then use one of those keys
       *   - will remember last random choice so it does not change on key stroke
       *   - remembering can be reset with this.__lastGetSuccessResult = false;
       */
      getSuccessTranslationsKeys(data) {
        let key = `success.${data.validatorName}`;
        if (this.__lastGetSuccessResult && data.validatorName.indexOf('random') === 0) {
          return this.__lastGetSuccessResult;
        }
        if (data.validatorName.indexOf('random') === 0) {
          const getKeys = this.constructor.__getLocalizeKeys(key, data.validatorName);
          const keysToConsider = this.translateMessage(getKeys); // eslint-disable-line max-len
          if (keysToConsider) {
            const randomKeys = keysToConsider.split(',');
            key = randomKeys[Math.floor(Math.random() * randomKeys.length)].trim();
          }
        }
        const result = this.constructor.__getLocalizeKeys(key, data.validatorName);
        this.__lastGetSuccessResult = result;
        return result;
      }

      /**
       * Returns all the translation paths in right priority order
       *
       * @param {string} key usually `${type}.${validatorName}`
       * @param {string} validatorName for which to create the keys
       */
      static __getLocalizeKeys(key, validatorName) {
        const result = [];
        this.localizeNamespaces.forEach(ns => {
          const namespace = typeof ns === 'object' ? Object.keys(ns)[0] : ns;
          result.push(`${namespace}+${validatorName}:${key}`);
          result.push(`${namespace}:${key}`);
        });
        return result;
      }

      __getMeta(result, type, validatorParams, validatorConfig, name, value) {
        const metaResults = [];

        // eslint-disable-next-line
        for (const validatorName in result) {
          if (result[validatorName] === false) {
            const data = {
              validatorName,
              validatorParams,
              validatorConfig,
              validatorType: type,
              name,
              value,
            };
            metaResults.push({
              data,
              translationKeys: this[`get${pascalCase(type)}TranslationsKeys`](data),
            });
          }
        }
        return metaResults;
      }

      static __normalizeValidatorResult(result, validator) {
        if (typeof result === 'boolean') {
          // class based, so get name
          return {
            [validator.name]: result
          }
        }
        return result;
      }

      /**
       * type can be 'error', 'warning', 'info', 'success'
       *
       * a Validator can be
       * - special string
       *     'required'
       * - function e.g
       *     MyValidate.isEmail, isCat, ...
       * - array for parameters e.g.
       *     [minMaxLength, {min: 10, max: 15}],
       *     [minLength, {min: 5}],
       *     [contains, 'thisString']
       */
      async validateType(type) {
        function getResults(resultList) {
          let result = {};
          if (resultList.length > 0) {
            result = {
              list: resultList, // TODO: maybe call this details?
            };
            // <lion-form> will have a reference to lion-field by name, so user can do:
            // formName.fieldName.errors.validatorName
            resultList.forEach(resultListElement => {
              result[resultListElement.data.validatorName] = true;
            });
          }

          const x = {
            [`${type}State`]:  resultList.length > 0,
            [type] : result,
          }
          return x;
        }

        const ctor = this.constructor;

        const validators = this.getValidatorsForType(type);
        if (!(validators && Array.isArray(validators) && validators.length > 0)) return;

        const resultList = [];
        let value = this.modelValue; // This will end up being modelValue or Unparseable.viewValue

        // When the modelValue can't be created, still allow all validators to give valuable
        // feedback to the user based on the current viewValue.
        if (value instanceof Unparseable) {
          value = value.viewValue;
        }

        const asyncValidators = [];

        for (let i = 0; i < validators.length; i += 1) {
          let validatorFn;
          let validatorParams;
          let validatorConfig;

          if (validators[i] instanceof Validator) {
            validatorFn = validators[i].execute;
            validatorParams = validators[i].param;
            validatorConfig = validators[i].config;

            if (validators[i].async) {
              asyncValidators.push(validators[i]);
              break;
            }
          } else {
            // TODO: needed for backwards compatibility: add in extending layer
            const validatorArray = Array.isArray(validators[i]) ? validators[i] : [validators[i]];
            [validatorFn, validatorParams, validatorConfig] = validatorArray;
          }

          let isRequiredValidator = false; // Whether the current is the required validator
          if (typeof validatorFn === 'string' && validatorFn === 'required' && this.__isRequired) {
            validatorFn = this.__isRequired;
            isRequiredValidator = true;
          }

          // We don't validate empty values, unless its 'required'
          const shouldValidate = isRequiredValidator || !this.constructor.__isEmpty(value);

          if (typeof validatorFn === 'function') {
            if (shouldValidate) {
              let result = validatorFn(value, validatorParams);
              result = ctor.__normalizeValidatorResult(result, validators[i]);

              const meta = this.__getMeta(result, type, validatorParams, validatorConfig, this.name, this.modelValue);
              // if (meta) {
              //   resultList.push(meta);
              // }
              meta.forEach((m) => resultList.push(m));

              // eslint-disable-next-line no-restricted-syntax
              // for (const validatorName in result) {
              //   if (!result[validatorName]) {
              //     const data = {
              //       validatorName,
              //       validatorParams,
              //       validatorConfig,
              //       validatorType: type,
              //       name: this.name,
              //       value: this.modelValue,
              //     };
              //     resultList.push({
              //       data,
              //       translationKeys: this[`get${pascalCase(type)}TranslationsKeys`](data),
              //     });
              //   }
              // }
            }
          } else {
            console.warn('That does not look like a validator function', validatorFn); // eslint-disable-line
            // eslint-disable-next-line
            console.warn(
              // eslint-disable-next-line
              'You should provide options like so errorValidators=${[[functionName, {min: 5, max: 10}]]}',
            );
          }
        }

        Object.assign(this, getResults(resultList));

        // if we have async validators, there is some work left
        if (asyncValidators.length) {
          const promises = [];
          asyncValidators.forEach((validator) => {
            promises.push(validator.execute(value, validator.param));
          });
          const results = await Promise.all(promises);
          results.forEach((res, i) => {
            const result = ctor.__normalizeValidatorResult(res, validators[i]);
            const meta = this.__getMeta(result, type, asyncValidators[i].param, asyncValidators[i].config, type, this.name, this.modelValue);
            meta.forEach(m => resultList.push(m));
          });
          Object.assign(this, getResults(resultList));
        }
      }

      getValidatorsForType(type) {
        if (this.defaultSuccessFeedback && type === 'success') {
          return [[randomOk]].concat(this.successValidators || []);
        }
        return this[`${type}Validators`] || [];
      }

      static _objectEquals(result, prevResult) {
        if (!prevResult) return false;
        return Object.keys(result).join('') === Object.keys(prevResult).join('');
      }

      // When empty (model)value,
      static __isEmpty(v) {
        return v === null || typeof v === 'undefined' || v === '';
      }
    },
);
