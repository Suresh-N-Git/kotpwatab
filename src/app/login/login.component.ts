import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedMaterialModule } from '../SharedMaterialModule';
import { SharedDirectiveModule } from '../SharedDirectivesModule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../homeservice/home.service';
import { Subscription } from 'rxjs';
import { SweetalertService } from '../sweetalert/sweetalert.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule, SharedDirectiveModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  changeForm: FormGroup;
  showPassword = false; // toggle state
  subscription: Subscription = new Subscription();

  TSLoginPlaceHolder: any;
  TSLoginMaxlength: any;
  TSLoginRequired: any;

  loginTableSchema = [
    { txtname: "txtLoginName", DisplayName: "User Name *", Required: "YES", MaxLength: "50" },
    { txtname: "txtLoginPassword", DisplayName: "Password *", Required: "YES", MaxLength: "20" },
  ];

  constructor(
    private fb: FormBuilder,
    private route: Router,
    public homeService: HomeService,
    public sweetAlert: SweetalertService) {
    this.getepData();
  }

  ngOnInit(): void {
    sessionStorage.clear();
    //localStorage.clear();
    this.loginForm = this.fb.group({
      txtLoginName: [''],
      txtLoginPassword: ['']
    });

    this.changeForm = this.fb.group({
      txtLoginName: [''],
      txtOldPassword: [''],
      txtNewPassword: [''],
      txtConfirmPassword: ['']
    })

    // this.sweetAlert.show('Success', 'Success Message', 'success')
    // this.sweetAlert.autoClose('Success', 'Success Message')
    // this.sweetAlert.confirm('Proceed ?', 'Do you really want to continue?')
    //   .then(res => {
    //     if (res.isConfirmed) {
    //       this.sweetAlert.show('Confirmed', 'Action executed successfully!', 'success');
    //     } else {
    //       this.sweetAlert.autoClose('Cancelled', 'By User', 'info');
    //     }
    //   });
    this.loginForm.reset();
    this.getLoginTableSchema();
    // this.getChangeTableSchema();
  }

  get loginControl() { return this.loginForm.controls }
  get control() { return this.changeForm.controls }

  getepData() {
    //https://www.techiediaries.com/angular-local-json-files/ // epdata is endpointdata
    this.subscription.add(
      this.homeService.getepData().subscribe({
        next: (response: any) => {
          console.log('getepData ', response)
          this.homeService.baseURLCommon = response.baseURL + 'Common/';
          sessionStorage.setItem('baseURL', response.baseURL + 'Common/');
          sessionStorage.setItem('helpURL', response.helpURL);
        }, error: (err) => {
          this.sweetAlert.show('Error', err, "error")
        }
      })
    )
  }

  getLoginTableSchema() {
    this.TSLoginPlaceHolder = this.loginTableSchema.reduce((acc, cur) => ({ ...acc, [cur.txtname]: cur.DisplayName }), {});
    this.TSLoginMaxlength = this.loginTableSchema.reduce((acc, cur) => ({ ...acc, [cur.txtname]: cur.MaxLength }), {});
    this.TSLoginRequired = this.loginTableSchema.reduce((acc, cur) => ({ ...acc, [cur.txtname]: cur.Required }), {});
    this.setLoginValidation();
  }

  setLoginValidation() {
    Object.keys(this.TSLoginRequired).forEach(element => {
      let required: string = this.TSLoginRequired[element];
      if (required.toLowerCase() === 'yes') {
        if (this.loginForm.get(element)) {
          this.loginForm.get(element).setValidators([Validators.required]);
          this.loginForm.get(element).updateValueAndValidity();
        }
      }
    });
  }


  loginSubmit() {
    if (this.loginForm.invalid) {
      return;
    } else if (this.loginControl['txtLoginPassword'].value
      && this.loginControl['txtLoginPassword'].value.toLowerCase() === 'password2') {
      this.sweetAlert.show('Error', 'Default Password Cannot Be used. Change Password to Login', "error")
      return;
    }

    //   // https://stackoverflow.com/questions/71471860/angular-subscribe-is-deprecated
    this.subscription.add(
      this.homeService.validateLogin(
        this.loginControl['txtLoginName'].value,
        this.loginControl['txtLoginPassword'].value)
        .subscribe({
          next: (response: any) => {
            console.log('response',response)
            sessionStorage.setItem('ssLoginDetails', JSON.stringify(response[0]));
            sessionStorage.setItem('ssLoginName', this.loginControl['txtLoginName'].value)
            // this.sweetAlert.show('Success', 'Valid Login', 'success')
            this.route.navigate(['dashboard']).then(() => {
              this.loginForm.reset();
            })
          }, error: (err) => {
            // this.route.navigate(['dashboard']).then(() => {
            //   this.loginForm.reset();
            // })
            this.sweetAlert.show('Error', err, "error")
          }
        })
    )
  }
}
