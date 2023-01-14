import { surroundingAgent } from '../engine.mjs';
import {
  Type,
  Value,
  bridgeableForHost,
  bridgeableForGuest,
  tryBridgeToGuest,
} from '../value.mjs';
import {
  Assert,
  CreateDataPropertyOrThrow,
  CreateBuiltinFunction,
  CreateListFromArrayLike,
  Get,
  OrdinaryCreateFromConstructor,
  OrdinaryObjectCreate,
  RequireInternalSlot,
  SameValue,
  ToBoolean,
  ToNumber,
  ToObject,
  ToString,
} from '../abstract-ops/all.mjs';
import { Q, X } from '../completion.mjs';
import { bootstrapConstructor, bootstrapPrototype } from './bootstrap.mjs';
import { ArrayProto_map } from './ArrayPrototype.mjs';
import { Date_now } from './Date.mjs';


const UTS35Type = /^[a-zA-Z0-9]{3,8}(?:-[a-zA-Z0-9]{3,8})*$/;
const INTL_TEXT_OPTION_VALUES = ['narrow', 'short', 'long'];
const INTL_NUMERIC_OPTION_VALUES = ['2-digit', 'numeric'];

const CoerceOptionsToObject = options => {
  if (options === Value.undefined) return OrdinaryObjectCreate(Value.null);
  return Q(ToObject(options));
};

const GetOption = (options, name, type, values, defaultValue) => {
  let value = Q(Get(options, name));
  if (value === Value.undefined) {
    if (defaultValue === 'required') {
      return surroundingAgent.Throw('RangeError', 'MissingRequiredProperty', name);
    }
    return defaultValue;
  }
  if (type === 'boolean') {
    value = ToBoolean(value);
  } else if (type === 'number') {
    value = Q(ToNumber(value));
    if (value.isNaN()) return surroundingAgent.Throw('RangeError', 'OutOfRange', name);
  } else {
    Assert(type === 'string');
    value = Q(ToString(value));
  }
  if (values !== 'empty' && !values.some(x => SameValue(x, value) === Value.true)) {
    return surroundingAgent.Throw('RangeError', 'UnsupportedValueForProperty', name, value);
  }
  return value;
};

const GetNumberOption = (options, name, minimum, maximum, defaultValue) => {
  Assert(Type(options) === 'Object');
  let value = Q(Get(options, name));
  // DefaultNumberOption
  if (value === Value.undefined) return defaultValue;
  value = Q(ToNumber(value));
  const hostValue = bridgeableForHost(value);
  if (isNaN(hostValue) || hostValue < minimum || hostValue > maximum) {
    return surroundingAgent.Throw('RangeError', 'OutOfRange', name);
  }
  return new Value(Math.floor(hostValue));
};

const NO_ENUM = Symbol.for('empty');
const REQUIRED = Symbol.for('required');
// Make a GetOption helper that accepts input in the host domain
// (e.g., 'string' rather than Value('string').
const hostGetOption = (options, hostName, type, hostValues, hostDefaultValue = undefined) => {
  const values = hostValues === NO_ENUM ? 'empty' : hostValues.map(v => new Value(v));
  const defaultValue = hostDefaultValue === REQUIRED ?  'required' : new Value(hostDefaultValue);
  return GetOption(options, new Value(hostName), type, values, defaultValue);
};

// This partial implementation of CanonicalizeLocaleList is ignorant of Intl.Locale instances.
const limitedCanonicalizeLocaleList = locales => {
  if (locales === Value.undefined) return [];
  if (Type(locales) === 'String') return [locales];
  const toLanguageTag = ([item]) => {
    if (Type(item) !== 'String' && Type(item) !== 'Object') {
      return surroundingAgent.Throw('TypeError', 'NotATypeObject', 'string or', item);
    }
    const tag = Q(ToString(item));
    try {
      new Intl.Locale(bridgeableForHost(tag));
    } catch (err) {
      return surroundingAgent.Throw('RangeError', 'NotWellFormed', 'locale identifier', tag);
    }
    return tag;
  };
  const callback = CreateBuiltinFunction(toLanguageTag, 1, new Value('toLanguageTag'), []);
  return CreateListFromArrayLike(Q(ArrayProto_map([callback], { thisValue: locales })));
};


const DTF_COMPONENTS = {
  weekday: INTL_TEXT_OPTION_VALUES,
  era: INTL_TEXT_OPTION_VALUES,
  year: INTL_NUMERIC_OPTION_VALUES,
  month: [...INTL_NUMERIC_OPTION_VALUES, ...INTL_TEXT_OPTION_VALUES],
  day: INTL_NUMERIC_OPTION_VALUES,
  dayPeriod: INTL_TEXT_OPTION_VALUES,
  hour: INTL_NUMERIC_OPTION_VALUES,
  minute: INTL_NUMERIC_OPTION_VALUES,
  second: INTL_NUMERIC_OPTION_VALUES,
  fractionalSecondDigits: [1, 2, 3],
  timeZoneName: ['short', 'long', 'shortOffset', 'longOffset', 'shortGeneric', 'longGeneric'],
};


export function bootstrapIntl(realmRec) {
  if (typeof Intl !== 'object') return;
  const hostDTF = Intl.DateTimeFormat;

  const withDTFBrand = fn => (args, context) => {
    Q(RequireInternalSlot(context.thisValue, 'HostDTFInstance'));
    return fn(args, context);
  };

  const dtfProto = realmRec.Intrinsics['%DateTimeFormat.prototype%'] = bootstrapPrototype(
    realmRec,
    [
      // `format` is a brand-checking getter for a lazy-initialized bound method.
      ['format', [withDTFBrand((args, { thisValue }) => {
        if (!thisValue.BoundFormat || thisValue.BoundFormat === Value.undefined) {
          thisValue.BoundFormat = CreateBuiltinFunction(([date = Value.undefined]) => {
            let x;
            if (date === Value.undefined) {
              x = X(Date_now());
            } else {
              x = Q(ToNumber(date));
            }
            const hostX = bridgeableForHost(x);
            const hostThunk = () => thisValue.HostDTFInstance.format(hostX);
            return tryBridgeToGuest(hostThunk, realmRec);
          }, 1, new Value(''), [], realmRec);
        }
        return thisValue.BoundFormat;
      })]],

      // The other methods are more conventional.
      ['formatToParts', withDTFBrand(([date = Value.undefined], { thisValue }) => {
        let x;
        if (date === Value.undefined) {
          x = X(Date_now());
        } else {
          x = Q(ToNumber(date));
        }
        const hostX = bridgeableForHost(x);
        const hostThunk = () => thisValue.HostDTFInstance.formatToParts(hostX);
        return tryBridgeToGuest(hostThunk, realmRec);
      }), 1],
      ['formatRange', withDTFBrand(([startDate = Value.undefined, endDate = Value.undefined], { thisValue }) => {
        if (startDate === Value.undefined || endDate === Value.undefined) {
          return surroundingAgent.Throw(
            'TypeError',
            'MissingRequiredArgument',
            'startDate, endDate',
          );
        }
        const x = Q(ToNumber(startDate));
        const y = Q(ToNumber(endDate));
        const hostX = bridgeableForHost(x);
        const hostY = bridgeableForHost(y);
        const hostThunk = () => thisValue.HostDTFInstance.formatRange(hostX, hostY);
        return tryBridgeToGuest(hostThunk, realmRec);
      }), 2],
      ['formatRangeToParts', withDTFBrand(([startDate = Value.undefined, endDate = Value.undefined], { thisValue }) => {
        if (startDate === Value.undefined || endDate === Value.undefined) {
          return surroundingAgent.Throw(
            'TypeError',
            'MissingRequiredArgument',
            'startDate, endDate',
          );
        }
        const x = Q(ToNumber(startDate));
        const y = Q(ToNumber(endDate));
        const hostX = bridgeableForHost(x);
        const hostY = bridgeableForHost(y);
        const hostThunk = () => thisValue.HostDTFInstance.formatRangeToParts(hostX, hostY);
        return tryBridgeToGuest(hostThunk, realmRec);
      }), 2],
      ['resolvedOptions', withDTFBrand((args, { thisValue }) => {
        const hostThunk = () => thisValue.HostDTFInstance.resolvedOptions();
        return tryBridgeToGuest(hostThunk, realmRec);
      }), 0],
    ],
    realmRec.Intrinsics['%Object.prototype%'],
    'Intl.DateTimeFormat',
  );

  const supportedLocalesOf = ([locales = Value.undefined, options = Value.undefined]) => {
    const hostRequestedLocales = Q(limitedCanonicalizeLocaleList(locales)).map(bridgeableForHost);

    // partial SupportedLocales
    const optionsObject = Q(CoerceOptionsToObject(options));
    const localeMatcher = Q(hostGetOption(
      optionsObject,
      'localeMatcher',
      'string',
      ['lookup', 'best fit'],
      'best fit',
    ));
    const hostOptions = {
      localeMatcher: bridgeableForHost(localeMatcher),
    };

    // result
    const hostThunk = () => hostDTF.supportedLocalesOf(hostRequestedLocales, hostOptions);
    return tryBridgeToGuest(hostThunk, realmRec);
  };

  function DTFConstructor([locales = Value.undefined, options = Value.undefined], { NewTarget }) {
    if (NewTarget === Value.undefined) {
      NewTarget = surroundingAgent.activeFunctionObject;
    }

    return Q(CreateDateTimeFormat(NewTarget, locales, options, 'any', 'date'));
  }

  function CreateDateTimeFormat(newTarget, locales, options, requiredCategory, defaultsCategory) {
    const dateTimeFormat = Q(OrdinaryCreateFromConstructor(
      newTarget,
      '%DateTimeFormat.prototype%',
      // We defer to a host instance, replacing the need for most internal slots.
      ['HostDTFInstance', 'BoundFormat'],
    ));
    const requestedLocales = Q(limitedCanonicalizeLocaleList(locales));
    options = Q(CoerceOptionsToObject(options));
    const localeMatcher = Q(hostGetOption(
      options,
      'localeMatcher',
      'string',
      ['lookup', 'best fit'],
      'best fit',
    ));
    const calendar = Q(hostGetOption(options, 'calendar', 'string', NO_ENUM));
    if (calendar !== Value.undefined) {
      if (!UTS35Type.test(bridgeableForHost(calendar))) {
        return surroundingAgent.Throw(
          'RangeError',
          'NotWellFormed',
          'Unicode BCP 47 -u- extension keyword type value',
          calendar,
        );
      }
    }
    const numberingSystem = Q(hostGetOption(options, 'numberingSystem', 'string', NO_ENUM));
    if (numberingSystem !== Value.undefined) {
      if (!UTS35Type.test(bridgeableForHost(numberingSystem))) {
        return surroundingAgent.Throw(
          'RangeError',
          'NotWellFormed',
          'Unicode BCP 47 -u- extension keyword type value',
          numberingSystem,
        );
      }
    }
    const hour12 = Q(hostGetOption(options, 'hour12', 'boolean', NO_ENUM));
    let hourCycle = Q(hostGetOption(options, 'hourCycle', 'string', ['h11', 'h12', 'h23', 'h24']));
    const hostOptions = {
      localeMatcher: bridgeableForHost(localeMatcher),
      calendar: bridgeableForHost(calendar),
      numberingSystem: bridgeableForHost(numberingSystem),
      hour12: bridgeableForHost(hour12),
      hourCycle: bridgeableForHost(hourCycle),
    };
    // ...
    let timeZone = Q(Get(options, new Value('timeZone')));
    if (timeZone !== Value.undefined) {
      timeZone = Q(ToString(timeZone));
      const hostRequestedTimeZone = bridgeableForHost(timeZone);
      let hostTimeZone;
      try {
        hostTimeZone =
          new hostDTF(undefined, { timeZone: hostRequestedTimeZone }).resolvedOptions().timeZone;
      } catch (err) {
        return surroundingAgent.Throw(
          'RangeError',
          'NotWellFormed',
          'IANA time zone name',
          timeZone,
        );
      }
      timeZone = new Value(hostTimeZone);
    }
    hostOptions.timeZone = bridgeableForHost(timeZone);
    let hasExplicitFormatComponents = Value.false;
    for (const [hostName, hostValues] of Object.entries(DTF_COMPONENTS)) {
      let value;
      if (hostName === 'fractionalSecondDigits') {
        value = Q(GetNumberOption(options, new Value(hostName), 1, 3, Value.undefined));
      } else {
        value = Q(hostGetOption(options, hostName, 'string', hostValues));
      }
      hostOptions[hostName] = bridgeableForHost(value);
      if (value !== Value.undefined) hasExplicitFormatComponents = Value.true;
    }
    hostOptions.formatMatcher = bridgeableForHost(
      Q(hostGetOption(options, 'formatMatcher', 'string', ['basic', 'best fit'], 'best fit'))
    );
    hostOptions.dateStyle = bridgeableForHost(
      Q(hostGetOption(options, 'dateStyle', 'string', ['full', 'long', 'medium', 'short']))
    );
    hostOptions.timeStyle = bridgeableForHost(
      Q(hostGetOption(options, 'timeStyle', 'string', ['full', 'long', 'medium', 'short']))
    );
    if (hostOptions.dateStyle !== undefined || hostOptions.timeStyle !== undefined) {
      let errMessage;
      if (hasExplicitFormatComponents === Value.true) {
        errMessage = '"dateStyle" and "timeStyle" prohibit component-specific formatting';
      } else if (requiredCategory === 'date' && hostOptions.timeStyle !== undefined) {
        errMessage = 'date-only formatting prohibits "timeStyle"';
      } else if (requiredCategory === 'time' && hostOptions.dateStyle !== undefined) {
        errMessage = 'time-only formatting prohibits "dateStyle"';
      }
      if (errMessage) return surroundingAgent.Throw('TypeError', 'IncompatibleOptions', errMessage);
    } else {
      let needDefaults = Value.true;
      if (requiredCategory === 'date' || requiredCategory === 'any') {
        for (const prop of ['weekday', 'year', 'month', 'day']) {
          const value = hostOptions[prop];
          if (value !== undefined) needDefaults = Value.false;
        }
      }
      if (requiredCategory === 'time' || requiredCategory === 'any') {
        for (const prop of ['dayPeriod', 'hour', 'minute', 'second', 'fractionalSecondDigits']) {
          const value = hostOptions[prop];
          if (value !== undefined) needDefaults = Value.false;
        }
      }
      if (needDefaults === Value.true && ['date', 'all'].includes(defaultsCategory)) {
        for (const prop of ['year', 'month', 'day']) {
          hostOptions[prop] = 'numeric';
        }
      }
      if (needDefaults === Value.true && ['time', 'all'].includes(defaultsCategory)) {
        for (const prop of ['hour', 'minute', 'second']) {
          hostOptions[prop] = 'numeric';
        }
      }
    }

    const hostRequestedLocales = bridgeableForHost(requestedLocales);
    try {
      dateTimeFormat.HostDTFInstance = new hostDTF(hostRequestedLocales, hostOptions);
    } catch (err) {
      return surroundingAgent.Throw(err.name, 'Raw', err.message);
    }
    return dateTimeFormat;
  }

  const DTF = realmRec.Intrinsics['%DateTimeFormat%'] = bootstrapConstructor(
    realmRec,
    DTFConstructor,
    'DateTimeFormat',
    0,
    dtfProto,
    [
      ['supportedLocalesOf', supportedLocalesOf, 1],
    ],
  );

  realmRec.Intrinsics['%Intl%'] = bootstrapPrototype(realmRec, [
    ['DateTimeFormat', DTF, 0],
  ], realmRec.Intrinsics['%Object.prototype%'], 'Intl');
}
