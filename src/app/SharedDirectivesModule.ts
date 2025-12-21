import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirNosOnly } from './core/directives/app.directive';
import { TrimOnBlurDirective } from './core/directives/app.directive';
import { RestrictStringValidatorDirective } from './core/directives/app.directive';
import { DisableButtonOnSubmitDirective } from './core/directives/app.directive';
import { CapsAlphabetsDirective } from './core/directives/app.directive';
import { DecimalOnlyDirective } from './core/directives/app.directive';
import { RemoveAriaHiddenDirective } from './core/directives/app.directive';


@NgModule({
  declarations: [
    DirNosOnly,
    TrimOnBlurDirective,
    RestrictStringValidatorDirective,
    DisableButtonOnSubmitDirective,
    CapsAlphabetsDirective,
    DecimalOnlyDirective,
    RemoveAriaHiddenDirective
    // Add other directives here
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DirNosOnly,
    TrimOnBlurDirective,
    RestrictStringValidatorDirective,
    DisableButtonOnSubmitDirective,
    CapsAlphabetsDirective,
    DecimalOnlyDirective,
    RemoveAriaHiddenDirective,
    // Export other directives here
  ]
})
export class SharedDirectiveModule { }
