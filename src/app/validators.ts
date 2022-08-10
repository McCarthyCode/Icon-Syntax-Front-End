import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export namespace Validators {
  export function containsUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || /[A-Z]+/.test(control.value)
        ? null
        : { containsUppercase: true };
    };
  }

  export function containsLowercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || /[a-z]+/.test(control.value)
        ? null
        : { containsLowercase: true };
    };
  }

  export function containsNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value || /\d+/.test(control.value)
        ? null
        : { containsNumber: true };
    };
  }

  export function containsPunctuation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !control.value ||
        /[!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]/.test(control.value)
        ? null
        : { containsPunctuation: true };
    };
  }
}
