import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function arabicTextValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arabicTextPattern = /^[\u0600-\u06FF\u0750-\u077F\s]+$/;
    const isValid = arabicTextPattern.test(control.value);
    return isValid ? null : { arabicText: true };
  };
}
export function englishOnlyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const englishRegex = /^[a-zA-Z0-9\s]*$/; // Regular expression for English characters (letters, numbers, and spaces)
      const isValid = englishRegex.test(control.value);
      return isValid ? null : { englishOnly: true };
    };
}