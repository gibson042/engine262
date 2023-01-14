import { surroundingAgent } from './engine.mjs';
import { Value } from './value.mjs';
import { inspect } from './api.mjs';

function i(V) {
  if (V instanceof Value) {
    return inspect(V, surroundingAgent.currentRealmRecord, true);
  }
  return `${V}`;
}

export const Raw = (s) => s;

export const AlreadyDeclared = (n) => `${i(n)} is already declared`;
export const ArrayBufferDetached = () => 'Attempt to access detached ArrayBuffer';
export const ArrayBufferShared = () => 'Attempt to access shared ArrayBuffer';
export const ArrayPastSafeLength = () => 'Cannot make length of array-like object surpass the bounds of an integer index';
export const ArrayEmptyReduce = () => 'Cannot reduce an empty array with no initial value';
export const AssignmentToConstant = (n) => `Assignment to constant variable ${i(n)}`;
export const AwaitInFormalParameters = () => 'await is not allowed in function parameters';
export const AwaitInClassStaticBlock = () => 'await is not allowed in class static blocks';
export const AwaitNotInAsyncFunction = () => 'await is only valid in async functions';
export const BigIntDivideByZero = () => 'Division by zero';
export const BigIntNegativeExponent = () => 'Exponent must be positive';
export const BigIntUnsignedRightShift = () => 'BigInt has no unsigned right shift, use >> instead';
export const BufferContentTypeMismatch = () => 'Newly created TypedArray did not match exemplar\'s content type';
export const BufferDetachKeyMismatch = (k, b) => `${i(k)} is not the [[ArrayBufferDetachKey]] of ${i(b)}`;
export const CannotAllocateDataBlock = () => 'Cannot allocate memory';
export const CannotCreateProxyWith = (x, y) => `Cannot create a proxy with a ${x} as ${y}`;
export const CannotConvertDecimalToBigInt = (n) => `Cannot convert ${i(n)} to a BigInt because it is not an integer`;
export const CannotConvertSymbol = (t) => `Cannot convert a Symbol value to a ${t}`;
export const CannotConvertToBigInt = (v) => `Cannot convert ${i(v)} to a BigInt`;
export const CannotConvertToObject = (t) => `Cannot convert ${t} to object`;
export const CannotDefineProperty = (p) => `Cannot define property ${i(p)}`;
export const CannotDeleteProperty = (p) => `Cannot delete property ${i(p)}`;
export const CannotDeleteSuper = () => 'Cannot delete a super property';
export const CannotJSONSerializeBigInt = () => 'Cannot serialize a BigInt to JSON';
export const CannotMixBigInts = () => 'Cannot mix BigInt and other types, use explicit conversions';
export const CannotResolvePromiseWithItself = () => 'Cannot resolve a promise with itself';
export const CannotSetProperty = (p, o) => `Cannot set property ${i(p)} on ${i(o)}`;
export const ClassMissingBindingIdentifier = () => 'Class declaration missing binding identifier';
export const ConstDeclarationMissingInitializer = () => 'Missing initialization of const declaration';
export const ConstructorNonCallable = (f) => `${i(f)} cannot be invoked without new`;
export const CouldNotResolveModule = (s) => `Could not resolve module ${i(s)}`;
export const DataViewOOB = () => 'Offset is outside the bounds of the DataView';
export const DeleteIdentifier = () => 'Delete of identifier in strict mode';
export const DeletePrivateName = () => 'Private fields cannot be deleted';
export const DateInvalidTime = () => 'Invalid time';
export const DerivedConstructorReturnedNonObject = () => 'Derived constructors may only return object or undefined';
export const DuplicateConstructor = () => 'A class may only have one constructor';
export const DuplicateExports = () => 'Module cannot contain duplicate exports';
export const DuplicateProto = () => 'An object literal may only have one __proto__ property';
export const FunctionDeclarationStatement = () => 'Functions can only be declared at top level or inside a block';
export const GeneratorRunning = () => 'Cannot manipulate a running generator';
export const IllegalBreakContinue = (isBreak) => `Illegal ${isBreak ? 'break' : 'continue'} statement`;
export const IllegalOctalEscape = () => 'Illegal octal escape';
export const IncompatibleOptions = (msg) => `Incompatible options: ${msg}`;
export const InternalSlotMissing = (o, s) => `Internal slot ${s} is missing for ${i(o)}`;
export const InvalidArrayLength = (l) => `Invalid array length: ${i(l)}`;
export const InvalidAssignmentTarget = () => 'Invalid assignment target';
export const InvalidCodePoint = () => 'Not a valid code point';
export const InvalidHint = (v) => `Invalid hint: ${i(v)}`;
export const InvalidMethodName = (name) => `Method cannot be named '${i(name)}'`;
export const InvalidPropertyDescriptor = () => 'Invalid property descriptor. Cannot both specify accessors and a value or writable attribute';
export const InvalidRadix = () => 'Radix must be between 2 and 36, inclusive';
export const InvalidReceiver = (f, v) => `${f} called on invalid receiver: ${i(v)}`;
export const InvalidRegExpFlags = (f) => `Invalid RegExp flags: ${f}`;
export const InvalidSuperCall = () => '`super` not expected here';
export const InvalidSuperProperty = () => '`super` not expected here';
export const InvalidTemplateEscape = () => 'Invalid escapes are only allowed in tagged templates';
export const InvalidThis = () => 'Invalid `this` access';
export const InvalidUnicodeEscape = () => 'Invalid unicode escape';
export const IteratorThrowMissing = () => 'The iterator does not provide a throw method';
export const JSONCircular = () => 'Cannot JSON stringify a circular structure';
export const JSONUnexpectedToken = () => 'Unexpected token in JSON';
export const JSONUnexpectedChar = (c) => `Unexpected character ${c} in JSON`;
export const JSONExpected = (e, a) => `Expected character ${e} but got ${a} in JSON`;
export const LetInLexicalBinding = () => '\'let\' is not allowed to be used as a name in lexical declarations';
export const MissingRequiredArgument = (n) => `Argument(s) required: ${n}`;
export const MissingRequiredProperty = (n) => `Missing required property ${i(n)}`;
export const ModuleExportNameInvalidUnicode = () => 'Export name is not valid unicode';
export const ModuleUndefinedExport = (n) => `Export '${i(n)}' is not defined in module`;
export const NegativeIndex = (n) => `${n} cannot be negative`;
export const NewlineAfterThrow = () => 'Illegal newline after throw';
export const NormalizeInvalidForm = () => 'Invalid normalization form';
export const NotAConstructor = (v) => `${i(v)} is not a constructor`;
export const NotAFunction = (v) => `${i(v)} is not a function`;
export const NotATypeObject = (t, v) => `${i(v)} is not a ${t} object`;
export const NotAnObject = (v) => `${i(v)} is not an object`;
export const NotASymbol = (v) => `${i(v)} is not a symbol`;
export const NotDefined = (n) => `${i(n)} is not defined`;
export const NotInitialized = (n) => `${i(n)} cannot be used before initialization`;
export const NotPropertyName = (p) => `${i(p)} is not a valid property name`;
export const NotWellFormed = (t, v) => `${i(v)} is not a well-formed ${t}`;
export const NumberFormatRange = (m) => `Invalid format range for ${m}`;
export const ObjectToPrimitive = () => 'Cannot convert object to primitive value';
export const ObjectPrototypeType = () => 'Object prototype must be an Object or null';
export const ObjectSetPrototype = () => 'Could not set prototype of object';
export const OutOfRange = (n) => `${n} is out of range`;
export const PrivateNameNoGetter = (p) => `${i(p)} was defined without a getter`;
export const PrivateNameNoSetter = (p) => `${i(p)} was defined without a setter`;
export const PrivateNameIsMethod = (p) => `Private method ${i(p)} is not writable`;
export const PromiseAnyRejected = () => 'No promises passed to Promise.any were fulfilled';
export const PromiseCapabilityFunctionAlreadySet = (f) => `Promise ${f} function already set`;
export const PromiseRejectFunction = (v) => `Promise reject function ${i(v)} is not callable`;
export const PromiseResolveFunction = (v) => `Promise resolve function ${i(v)} is not callable`;
export const ProxyRevoked = (n) => `Cannot perform '${n}' on a proxy that has been revoked`;
export const ProxyDefinePropertyNonConfigurable = (p) => `'defineProperty' on proxy: trap returned truthy for defining non-configurable property ${i(p)} which is either non-existent or configurable in the proxy target`;
export const ProxyDefinePropertyNonConfigurableWritable = (p) => `'defineProperty' on proxy: trap returned truthy for defining non-configurable property ${i(p)} which cannot be non-writable, unless there exists a corresponding non-configurable, non-writable own property of the target object`;
export const ProxyDefinePropertyNonExtensible = (p) => `'defineProperty' on proxy: trap returned truthy for adding property ${i(p)} to the non-extensible proxy target`;
export const ProxyDefinePropertyIncompatible = (p) => `'defineProperty' on proxy: trap returned truthy for adding property ${i(p)} that is incompatible with the existing property in the proxy target`;
export const ProxyDeletePropertyNonConfigurable = (p) => `'deleteProperty' on proxy: trap returned truthy for property ${i(p)} which is non-configurable in the proxy target`;
export const ProxyDeletePropertyNonExtensible = (p) => `'deleteProperty' on proxy: trap returned truthy for property ${i(p)} but the proxy target is non-extensible`;
export const ProxyGetNonConfigurableData = (p) => `'get' on proxy: property ${i(p)} is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value`;
export const ProxyGetNonConfigurableAccessor = (p) => `'get' on proxy: property ${i(p)} is a non-configurable accessor property on the proxy target and does not have a getter function, but the trap did not return 'undefined'`;
export const ProxyGetPrototypeOfInvalid = () => '\'getPrototypeOf\' on proxy: trap returned neither object nor null';
export const ProxyGetPrototypeOfNonExtensible = () => '\'getPrototypeOf\' on proxy: proxy target is non-extensible but the trap did not return its actual prototype';
export const ProxyGetOwnPropertyDescriptorIncompatible = (p) => `'getOwnPropertyDescriptor' on proxy: trap returned descriptor for property ${i(p)} that is incompatible with the existing property in the proxy target`;
export const ProxyGetOwnPropertyDescriptorInvalid = (p) => `'getOwnPropertyDescriptor' on proxy: trap returned neither object nor undefined for property ${i(p)}`;
export const ProxyGetOwnPropertyDescriptorUndefined = (p) => `'getOwnPropertyDescriptor' on proxy: trap returned undefined for property ${i(p)} which is non-configurable in the proxy target`;
export const ProxyGetOwnPropertyDescriptorNonExtensible = (p) => `'getOwnPropertyDescriptor' on proxy: trap returned undefined for property ${i(p)} which exists in the non-extensible target`;
export const ProxyGetOwnPropertyDescriptorNonConfigurable = (p) => `'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property ${i(p)} which is either non-existent or configurable in the proxy target`;
export const ProxyGetOwnPropertyDescriptorNonConfigurableWritable = (p) => `'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property ${i(p)} which is writable or configurable in the proxy target`;
export const ProxyHasNonConfigurable = (p) => `'has' on proxy: trap returned falsy for property ${i(p)} which exists in the proxy target as non-configurable`;
export const ProxyHasNonExtensible = (p) => `'has' on proxy: trap returned falsy for property ${i(p)} but the proxy target is not extensible`;
export const ProxyIsExtensibleInconsistent = (e) => `'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is ${i(e)})`;
export const ProxyOwnKeysMissing = (p) => `'ownKeys' on proxy: trap result did not include ${i(p)}`;
export const ProxyOwnKeysNonExtensible = () => '\'ownKeys\' on proxy: trap result returned extra keys but proxy target is non-extensible';
export const ProxyOwnKeysDuplicateEntries = () => '\'ownKeys\' on proxy: trap returned duplicate entries';
export const ProxyPreventExtensionsExtensible = () => '\'preventExtensions\' on proxy: trap returned truthy but the proxy target is extensible';
export const ProxySetPrototypeOfNonExtensible = () => '\'setPrototypeOf\' on proxy: trap returned truthy for setting a new prototype on the non-extensible proxy target';
export const ProxySetFrozenData = (p) => `'set' on proxy: trap returned truthy for property ${i(p)} which exists in the proxy target as a non-configurable and non-writable data property with a different value`;
export const ProxySetFrozenAccessor = (p) => `'set' on proxy: trap returned truthy for property ${i(p)} which exists in the proxy target as a non-configurable and non-writable accessor property without a setter`;
export const RegExpArgumentNotAllowed = (m) => `First argument to ${m} must not be a regular expression`;
export const RegExpExecNotObject = (o) => `${i(o)} is not object or null`;
export const ResolutionNullOrAmbiguous = (r, n, m) => (r === null
  ? `Could not resolve import ${i(n)} from ${m.HostDefined.specifier}`
  : `Star export ${i(n)} from ${m.HostDefined.specifier} is ambiguous`);
export const SpeciesNotConstructor = () => 'object.constructor[Symbol.species] is not a constructor';
export const StrictModeDelete = (n) => `Cannot not delete property ${i(n)}`;
export const StrictPoisonPill = () => 'The caller, callee, and arguments properties may not be accessed on functions or the arguments objects for calls to them';
export const StringRepeatCount = (v) => `Count ${i(v)} is invalid`;
export const StringCodePointInvalid = (n) => `Invalid code point ${i(n)}`;
export const StringPrototypeMethodGlobalRegExp = (m) => `The RegExp passed to String.prototype.${m} must have the global flag`;
export const SubclassLengthTooSmall = (v) => `Subclass constructor returned a smaller-than-requested object ${i(v)}`;
export const SubclassSameValue = (v) => `Subclass constructor returned the same object ${i(v)}`;
export const TargetMatchesHeldValue = (v) => `heldValue ${i(v)} matches target`;
export const TemplateInOptionalChain = () => 'Templates are not allowed in optional chains';
export const ThisNotAFunction = (v) => `Expected 'this' value to be a function but got ${i(v)}`;
export const TryMissingCatchOrFinally = () => 'Missing catch or finally after try';
export const TypedArrayCreationOOB = () => 'Sum of start offset and byte length should be less than the size of underlying buffer';
export const TypedArrayLengthAlignment = (n, m) => `Size of ${n} should be a multiple of ${m}`;
export const TypedArrayOOB = () => 'Sum of start offset and byte length should be less than the size of the TypedArray';
export const TypedArrayOffsetAlignment = (n, m) => `Start offset of ${n} should be a multiple of ${m}`;
export const TypedArrayTooSmall = () => 'Derived TypedArray constructor created an array which was too small';
export const UnableToSeal = (o) => `Unable to seal object ${i(o)}`;
export const UnableToFreeze = (o) => `Unable to freeze object ${i(o)}`;
export const UnableToPreventExtensions = (o) => `Unable to prevent extensions on object ${i(o)}`;
export const UnknownPrivateName = (o, p) => `${i(p)} does not exist on object ${i(o)}`;
export const UnterminatedComment = () => 'Missing */ after comment';
export const UnterminatedRegExp = () => 'Missing / after RegExp literal';
export const UnterminatedString = () => 'Missing \' or " after string literal';
export const UnterminatedTemplate = () => 'Missing ` after template literal';
export const UnexpectedEOS = () => 'Unexpected end of source';
export const UnexpectedEvalOrArguments = () => '`arguments` and `eval` are not valid in this context';
export const UnexpectedToken = () => 'Unexpected token';
export const UnexpectedReservedWordStrict = () => 'Unexpected reserved word in strict mode';
export const UnsupportedValueForProperty = (n, v) => `Unsupported value ${i(v)} for property ${i(n)}`;
export const UseStrictNonSimpleParameter = () => 'Function with \'use strict\' directive has non-simple parameter list';
export const URIMalformed = () => 'URI malformed';
export const WeakCollectionNotObject = (v) => `${i(v)} is not a valid weak collection entry object`;
export const YieldInFormalParameters = () => 'yield is not allowed in function parameters';
export const YieldNotInGenerator = () => 'yield is only valid in generators';
