// @ts-nocheck
import { surroundingAgent } from '../engine.mjs';
import {
  Call,
  F,
  IsCallable,
  RequireInternalSlot,
  SameValueZero,
} from '../abstract-ops/all.mjs';
import {
  NumberValue,
  Value,
  wellKnownSymbols,
} from '../value.mjs';
import { Q, X } from '../completion.mjs';
import { bootstrapPrototype } from './bootstrap.mjs';
import { CreateSetIterator } from './SetIteratorPrototype.mjs';

/** https://tc39.es/ecma262/#sec-set.prototype.add */
function SetProto_add([value = Value.undefined], { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 4. For each e that is an element of entries, do
  for (const e of entries) {
    // a. For each e that is an element of entries, do
    if (e !== undefined && SameValueZero(e, value) === Value.true) {
      // i. Return S.
      return S;
    }
  }
  // 5. If value is -0𝔽, set value to +0𝔽.
  if (value instanceof NumberValue && Object.is(value.numberValue(), -0)) {
    value = F(+0);
  }
  // 6. Append value as the last element of entries.
  entries.push(value);
  // 7. Return S.
  return S;
}

/** https://tc39.es/ecma262/#sec-set.prototype.clear */
function SetProto_clear(args, { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 4. For each e that is an element of entries, do
  for (let i = 0; i < entries.length; i += 1) {
    // a. Replace the element of entries whose value is e with an element whose value is empty.
    entries[i] = undefined;
  }
  // 5. Return undefined.
  return Value.undefined;
}

/** https://tc39.es/ecma262/#sec-set.prototype.delete */
function SetProto_delete([value = Value.undefined], { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 4. For each e that is an element of entries, do
  for (let i = 0; i < entries.length; i += 1) {
    const e = entries[i];
    // a. If e is not empty and SameValueZero(e, value) is true, then
    if (e !== undefined && SameValueZero(e, value) === Value.true) {
      // i. Replace the element of entries whose value is e with an element whose value is empty.
      entries[i] = undefined;
      // ii. Return true.
      return Value.true;
    }
  }
  // 5. Return false.
  return Value.false;
}

/** https://tc39.es/ecma262/#sec-set.prototype.entries */
function SetProto_entries(args, { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Return ? CreateSetIterator(S, key+value).
  return Q(CreateSetIterator(S, 'key+value'));
}

/** https://tc39.es/ecma262/#sec-set.prototype.foreach */
function SetProto_forEach([callbackfn = Value.undefined, thisArg = Value.undefined], { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. If IsCallable(callbackfn) is false, throw a TypeError exception
  if (IsCallable(callbackfn) === Value.false) {
    return surroundingAgent.Throw('TypeError', 'NotAFunction', callbackfn);
  }
  // 4. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 5. For each element _e_ of _entries_, do
  for (const e of entries) {
    // a. If e is not empty, then
    if (e !== undefined) {
      // i. Perform ? Call(callbackfn, thisArg, « e, e, S »).
      Q(Call(callbackfn, thisArg, [e, e, S]));
    }
  }
  // 6. Return undefined.
  return Value.undefined;
}

/** https://tc39.es/ecma262/#sec-set.prototype.has */
function SetProto_has([value = Value.undefined], { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 4. Let entries be the List that is S.[[SetData]].
  for (const e of entries) {
    // a. If e is not empty and SameValueZero(e, value) is true, return true.
    if (e !== undefined && SameValueZero(e, value) === Value.true) {
      return Value.true;
    }
  }
  // 5. Return false.
  return Value.false;
}

/** https://tc39.es/ecma262/#sec-get-set.prototype.size */
function SetProto_sizeGetter(args, { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Perform ? RequireInternalSlot(S, [[SetData]]).
  Q(RequireInternalSlot(S, 'SetData'));
  // 3. Let entries be the List that is S.[[SetData]].
  const entries = S.SetData;
  // 4. Let count be 0.
  let count = 0;
  // 5. For each e that is an element of entries, do
  for (const e of entries) {
    // a. If e is not empty, set count to count + 1
    if (e !== undefined) {
      count += 1;
    }
  }
  // 6. Return 𝔽(count).
  return F(count);
}

/** https://tc39.es/ecma262/#sec-set.prototype.values */
function SetProto_values(args, { thisValue }) {
  // 1. Let S be the this value.
  const S = thisValue;
  // 2. Return ? CreateSetIterator(S, value).
  return Q(CreateSetIterator(S, 'value'));
}

export function bootstrapSetPrototype(realmRec) {
  const proto = bootstrapPrototype(realmRec, [
    ['add', SetProto_add, 1],
    ['clear', SetProto_clear, 0],
    ['delete', SetProto_delete, 1],
    ['entries', SetProto_entries, 0],
    ['forEach', SetProto_forEach, 1],
    ['has', SetProto_has, 1],
    ['size', [SetProto_sizeGetter]],
    ['values', SetProto_values, 0],
  ], realmRec.Intrinsics['%Object.prototype%'], 'Set');

  const valuesFunc = X(proto.GetOwnProperty(Value('values')));
  X(proto.DefineOwnProperty(Value('keys'), valuesFunc));
  X(proto.DefineOwnProperty(wellKnownSymbols.iterator, valuesFunc));

  realmRec.Intrinsics['%Set.prototype%'] = proto;
}
