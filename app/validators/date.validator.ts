import {AbstractControl, ValidatorFn} from "@angular/forms";

export function ValidateDate(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    return !/^\d{2}\.\d{2}\.\d{4}$/.test(control.value) ? {"ValidateDate": control.value} : null;
  }
}
