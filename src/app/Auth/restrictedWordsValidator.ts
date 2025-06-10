import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to restrict specific words from being included in a password
 * @param restrictedWords - Array of restricted words
 * @returns ValidatorFn - Function that performs validation
 */
export function restrictedWordsValidator(restrictedWords: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password: string = control.value;

    // Return null if the control is empty (validation not required)
    if (!password) {
      return null;
    }

    // Check if the password contains any restricted words
    const foundWord: string | undefined = restrictedWords.find((word) =>
      password.toLowerCase().includes(word.toLowerCase())
    );

    // Return an error if a restricted word is found
    return foundWord
      ? { restrictedWord: { word: foundWord, message: `'${foundWord}' is not allowed in the password.` } }
      : null;
  };
}
