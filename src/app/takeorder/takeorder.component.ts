import { Component, HostListener, OnInit } from '@angular/core';
import { ISODateToyyyyMMdd } from '../core/common-functions';
import { Subject, Subscription } from 'rxjs';
import { HomeService } from '../homeservice/home.service';
import { SweetalertService } from '../sweetalert/sweetalert.service';
import { SharedMaterialModule } from '../SharedMaterialModule';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-takeorder',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './takeorder.component.html',
  styleUrl: './takeorder.component.scss'
})


export class TakeorderComponent implements OnInit {

  selCategory: string;
  menuItemsAll: any[] = [];
  menuItemsByCategories: any[] = [];
  loginDetails: any;
  subscription: Subscription = new Subscription();
  serverDate: any;

  // 🔹 Reactive form root
  orderForm!: FormGroup;

  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    private sweetAlert: SweetalertService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    const state = history.state;
    this.selCategory = state?.catetgory ?? '';

    this.loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails') || '{}');

    const isoSystemDate = this.loginDetails.SystemDate
      ? new Date(this.loginDetails.SystemDate)
      : new Date();

    this.serverDate = ISODateToyyyyMMdd(isoSystemDate);

    this.menuItemsAll = JSON.parse(sessionStorage.getItem('ssMenuItems') || '[]');

    this.menuItemsByCategories =
      this.menuItemsAll.filter(item => item.Category === this.selCategory);

    // 🔹 Build reactive form AFTER data is ready
    this.buildForm();
  }

  // -------------------------------------------------------
  // Reactive Form Builders
  // -------------------------------------------------------

  private buildForm(): void {
    this.orderForm = this.fb.group({
      items: this.fb.array(
        this.menuItemsByCategories.map(item => this.createItemForm(item))
      )
    });
  }

  private createItemForm(item: any): FormGroup {
    return this.fb.group({
      Pm_Id: [item.Pm_Id],
      KotQty: [
        item.KotQty || '',
        [Validators.required, Validators.min(1)]
      ],
      ItemComment: [item.ItemComment || '']
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // -------------------------------------------------------
  // Action
  // -------------------------------------------------------

  addItem(index: number): void {
    const formValue = this.items.at(index).value;
    console.log('Selected Item:', formValue);
  }
}


// import { Component, HostListener, OnInit } from '@angular/core';
// import { ISODateToyyyyMMdd } from '../core/common-functions';
// import { Subject, Subscription } from 'rxjs';
// import { HomeService } from '../homeservice/home.service';
// import { SweetalertService } from '../sweetalert/sweetalert.service';
// import { SharedMaterialModule } from '../SharedMaterialModule';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { Location } from '@angular/common';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-takeorder',
//   standalone: true,
//   imports: [CommonModule, SharedMaterialModule],
//   templateUrl: './takeorder.component.html',
//   styleUrl: './takeorder.component.scss'
// })
// export class TakeorderComponent implements OnInit {

//   selCategory: string;
//   menuItemsAll: any = [];
//   menuItemsByCategories: any = [];
//   loginDetails: any;
//   subscription: Subscription = new Subscription();
//   serverDate: any;


//   constructor(
//     private router: Router,
//     private location: Location,
//     private homeService: HomeService,
//     public sweetAlert: SweetalertService,
//     private snackBar: MatSnackBar
//   ) { }

//   ngOnInit(): void {

//     orderForm: FormGroup;

//     const state = history.state;
//     this.selCategory = state?.catetgory ?? '';
//     this.loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails'));
//     console.log('this.selCategory ', this.selCategory)
//     let isoSystemDate = (this.loginDetails.SystemDate) ? new Date(this.loginDetails.SystemDate) : new Date();
//     this.serverDate = ISODateToyyyyMMdd(isoSystemDate);
//     this.menuItemsByCategories = JSON.parse(sessionStorage.getItem('ssMenuItems'));

//     this.menuItemsAll = JSON.parse(sessionStorage.getItem('ssMenuItems'));
//     this.menuItemsByCategories = this.menuItemsAll.filter(item => item.Category === this.selCategory)
//     console.log('his.menuCategories ', this.menuItemsByCategories)

//   }

//   addItem(element) : void {
//     console.log(element)

//   }
// }
