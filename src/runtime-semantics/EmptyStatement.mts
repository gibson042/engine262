// @ts-nocheck
import { NormalCompletion } from '../completion.mjs';

/** https://tc39.es/ecma262/#sec-empty-statement-runtime-semantics-evaluation */
//   EmptyStatement : `;`
export function Evaluate_EmptyStatement(_EmptyStatement) {
  // 1. Return NormalCompletion(empty).
  return NormalCompletion(undefined);
}
