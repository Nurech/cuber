/**
 * Example:
 * @ngLog
 * method(param: string) { //some code}
 *
 * It would look quite unprofessional if we would ship the app with loggers on
 * So lets check if this app is in production or dev, if it is on production we disable loggers
 *
 */

import { environment } from '../../../environments/environment';

/**
 * Console log a method and its params passed though
 */

export function NgLog(target: any, key: any, descriptor: any) {

  if (environment.production) {return;}

  // save a reference to the original method this way we keep the values currently in the
  // descriptor and don't overwrite what another decorator might have done to the descriptor.
  if(descriptor === undefined) {
    descriptor = Object.getOwnPropertyDescriptor(target, key);
  }
  var originalMethod = descriptor.value;

  //editing the descriptor/value parameter
  descriptor.value = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var inputData = args.map(function (a) { return (a); });
    // note usage of originalMethod here
    var result = originalMethod.apply(this, args);
    console.log("Call: " + key + "(" , {input: inputData} , ") => " , {return: result});
    return result;
  };

  // return edited descriptor as opposed to overwriting the descriptor
  return descriptor;
}

