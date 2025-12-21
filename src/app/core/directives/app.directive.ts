import { Directive, ElementRef, HostListener, forwardRef, Input, OnInit, Self, Optional, OnDestroy, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { AbstractControl, NgControl, NG_ASYNC_VALIDATORS, AsyncValidator, ValidationErrors } from '@angular/forms';
import { fromEvent, Subscription, Observable, of as observableOf, Subject } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[appApp]',
  standalone: true
})

export class AppDirective {
  constructor() { }
}

// After Adding a new Directive import it and include in declarations and exports in core.module.ts


// Numbers Only, with leading zeroes, space or both
// This is a four in one directive. handles all nos only requirement
// Numbers only, Numbers only with Leading zeroes, Nummbers only with space 
// and numbers only with Leading Zeroes and Space. Default is no for space and leadingZero


@Directive({
  selector: '[appRemoveAriaHidden]'
})
export class RemoveAriaHiddenDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.el.nativeElement.setAttribute('aria-hidden', 'false');
    console.log('aria-hidden set to false on:', this.el.nativeElement);
  }
}

@Directive({
  selector: '[nosOnly]'
})
export class DirNosOnly implements OnInit {

  @Input() enableNosOnly: boolean = true; // Enable/disable the directive's behavior

  //   @Input('nosOnly') set nosOnlyInput(value: any) {
  //   this.enableNosOnly = value !== false && value !== 'false';
  // }

  @Input() space: string = 'no';
  @Input() leadingZero: string = 'no';

  private readonly specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Enter', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Del', 'Insert', 'Delete', 'PageUp', 'PageDown'];
  private validKeys: Array<string>;
  private regexToValidate: RegExp;
  private pasteRegex: RegExp;

  constructor(
    private el: ElementRef,
    @Self()
    @Optional()
    private ngControl: NgControl
  ) { }

  ngOnInit() {
    // The directive's logic runs only if enabled.
    if (!this.enableNosOnly) {
      // If disabled, initialize validKeys as an empty array and exit.
      this.validKeys = [];
      return;
    }
    const allowSpace = this.space === 'yes';  ////  converts the string value into a boolean
    // allowSpace becomes true if this.space is 'yes', otherwise false.
    const allowLeadingZero = this.leadingZero === 'yes';  //// converts the string value into a boolean
    // allowLeadingZero becomes true if this.leadingZero is 'yes', otherwise false.

    if (allowLeadingZero) {
      this.regexToValidate = new RegExp(`^[0-9${allowSpace ? '\\s' : ''}]*$`);

    } else {
      // This regex prevents leading zeroes by ensuring the first digit is 1-9
      this.regexToValidate = new RegExp(`^[1-9][0-9${allowSpace ? '\\s' : ''}]*$`);

    }

    this.validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].concat(allowSpace ? ' ' : []);
    this.pasteRegex = new RegExp(allowSpace ? /[^0-9\s]+/g : /[^0-9]+/g);
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput = event.clipboardData?.getData('text/plain').replace(this.pasteRegex, '') || '';
    const maxLength = (this.el.nativeElement as HTMLInputElement).maxLength;

    if (this.ngControl?.control) {
      this.ngControl.control.patchValue(pastedInput.slice(0, maxLength));
    } else {
      this.el.nativeElement.value = pastedInput.slice(0, maxLength);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const inputValue = (this.el.nativeElement as HTMLInputElement).value;

    // Allow special keys like Backspace, Tab, etc.
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    // Check if the key pressed is a valid number key
    if (this.validKeys.includes(event.key)) {
      // If leading zeroes are not allowed and the current input is empty, prevent entering '0'
      if (this.leadingZero === 'no' && event.key === '0' && inputValue === '') {
        event.preventDefault();
      }
      return;
    }

    // If the key pressed is not valid, prevent it
    event.preventDefault();
  }


  @HostListener("focusout", ["$event.target.value"])
  onblur(value: string) {
    const trimmedValue = value.trim();
    const finalValue = parseFloat(trimmedValue) === 0 ? '0' : trimmedValue;

    if (this.ngControl?.control) {
      this.ngControl.control.patchValue(finalValue);
    } else {
      this.el.nativeElement.value = finalValue;
    }
  }
}
// End of Numbers Only

// <-- Trim all the leading and trailing white spaces -->
@Directive({
  selector: 'input[trimOnBlur]'
})
export class TrimOnBlurDirective implements OnInit, OnDestroy {

  @Input() public trimEventName: string = 'blur';

  @Input() enableTrimOnBlur: boolean = true; // Enable/disable the directive's behavior
  subscription: Subscription = new Subscription()

  constructor(private elementRef: ElementRef,
    @Self() @Optional() private ngControl: NgControl) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    // The directive's logic runs only if enabled.
    if (!this.enableTrimOnBlur) {
      return;
    }
    this.subscription.add(fromEvent(this.elementRef.nativeElement, this.trimEventName).pipe().subscribe(() => {

      if (this.ngControl) {
        // Check if ngControl exists. 
        const currentValue: string = this.ngControl.value?.toString();
        if (currentValue?.startsWith(' ') || currentValue?.endsWith(' ')) {
          this.ngControl.control.patchValue(currentValue?.trim());
        }
      } else {
        // Handle the case where ngControl is not available
        const currentValue: string = this.elementRef.nativeElement.value;
        if (currentValue.startsWith(' ') || currentValue.endsWith(' ')) {
          this.elementRef.nativeElement.value = currentValue.trim();
        }
      }
    })
    )
  }
}
// <-- End of Trim all the leading and trailing white spaces -->


// <-- Validation Strings Starts -->
@Directive({
  selector: '[restrictStringValidator][ngModel],[restrictStringValidator][formControl],[restrictStringValidator][formControlName]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => RestrictStringValidatorDirective), multi: true }
  ]
})
// Class definition for Custom Validator
// https://stackblitz.com/edit/mat-select-with-custom-validator?file=main.ts
export class RestrictStringValidatorDirective implements AsyncValidator {
  @Input('restrictStringValidator') restrictedKeyword: string;
  validate(ctrl: AbstractControl): Observable<ValidationErrors | null> {
    if (ctrl.value && this.restrictedKeyword === ctrl.value) {
      return observableOf({ 'selectType': true })
    }
    return observableOf(null);
  }
}
// <-- Validation Strings Ends -->

@Directive({
  selector: '[appThrottleClick]'
})
export class DisableButtonOnSubmitDirective {
  @Input()
  throttleTime = 2000;

  @Output()
  throttledClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      throttleTime(this.throttleTime)
    ).subscribe(e => this.throttledClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
// <-- Disable button after submit Ends -->

// <-- Capital Alphabets Starts -->
@Directive({
  selector: 'input[alphaCaps]'
})
export class CapsAlphabetsDirective implements OnInit, OnDestroy {

  @Input() public trimEventName: string = 'keyup';
  subscription: Subscription = new Subscription()

  constructor(private elementRef: ElementRef,
    @Self() private ngControl: NgControl) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.subscription.add(fromEvent(this.elementRef.nativeElement, this.trimEventName).pipe().subscribe(() => {
      const currentValue: string = this.ngControl.value?.toString();
      this.ngControl.control.patchValue(currentValue?.toUpperCase());
    })
    )
  }
}
// <-- Capital Alphabets Ends -->


// <-- Decimal Numbers Starts -->

@Directive({
  selector: 'input[decimalOnly]'
})
export class DecimalOnlyDirective implements OnInit {

  @Input() enableDecimalOnly: boolean = true; // Enable/disable the directive's behavior

  // Regular expression: Allows up to 2 decimal places.
  private regex: RegExp = /^\d*\.?\d{0,2}$/;
  // Allowed special keys.
  private specialKeys: string[] = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // If the directive is not enabled, do nothing.
    if (!this.enableDecimalOnly) {
      return;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    const currentValue: string = this.el.nativeElement.value ?? '';
    const cursorPosition = this.el.nativeElement.selectionStart ?? currentValue.length;
    const selectionEnd = this.el.nativeElement.selectionEnd ?? currentValue.length;

    // Simulate what the new value would be if the key is allowed
    const nextValue =
      currentValue.substring(0, cursorPosition) +
      event.key +
      currentValue.substring(selectionEnd);

    // Allow digits and `.` only if resulting value is valid
    if (!this.regex.test(nextValue)) {
      event.preventDefault();
    }
  }

  // @HostListener('keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   // Allow special keys (navigation, delete, etc.)
  //   if (this.specialKeys.includes(event.key)) {
  //     return;
  //   }

  //   // Safely get the current value of the input, defaulting to empty string.
  //   const currentValue: string = this.el.nativeElement.value ?? '';

  //   // Allow only one decimal point (.) from any keyboard.
  //   if ((event.key === '.' || event.key === 'Decimal') && currentValue.includes('.')) {
  //     event.preventDefault();
  //     return;
  //   }

  //   // Allow only digits or a decimal point.
  //   if (!/^\d$/.test(event.key) && event.key !== '.') {
  //     event.preventDefault();
  //   }
  // }

  @HostListener('paste', ['$event'])
  blockPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';

    if (!this.regex.test(clipboardData)) {
      return;
    }

    this.el.nativeElement.value = clipboardData;
  }
}

// <-- Decimal Numbers Ends -->