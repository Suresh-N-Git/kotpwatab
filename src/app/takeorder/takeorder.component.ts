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
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { SharedDirectiveModule } from "../SharedDirectivesModule";



@Component({
  selector: 'app-takeorder',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule, SharedDirectiveModule],
  templateUrl: './takeorder.component.html',
  styleUrl: './takeorder.component.scss'
})


export class TakeorderComponent implements OnInit {

  selCategory: string;
  menuItemsAll: any[] = [];
  menuItemsByCategories: any[] = [];
  filteredMenuItems: any[] = [];
  loginDetails: any;
  subscription: Subscription = new Subscription();
  serverDate: any;

  orderedItems: any[] = [];
  // 🔹 Reactive form root
  orderForm!: FormGroup;
  searchControl = new FormControl('');

  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    private sweetAlert: SweetalertService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

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

    // 🔹 Initial filtered list
    this.filteredMenuItems = [...this.menuItemsByCategories];

    // 🔹 Search subscription
    this.searchControl.valueChanges.subscribe(searchText => {
      this.applySearch(searchText);
    });

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

  private applySearch(searchText: string): void {
    const text = (searchText || '').toLowerCase();

    this.filteredMenuItems = this.menuItemsByCategories.filter(item =>
      item.Description.toLowerCase().includes(text)
    );
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // -------------------------------------------------------
  // Action
  // -------------------------------------------------------

  addItem(index: number, element: any): void {
    const formValue = this.items.at(index).value;

    if (!formValue.KotQty) {
      this.sweetAlert.show('error', 'Qty Required', 'error');
      return;
    }

    // 1️⃣ Capture pmid BEFORE doing anything else
    const pmid = element.Pm_Id;

    // 2️⃣ Remove ONLY the matching item
    if (pmid !== undefined && pmid !== null) {
      this.orderedItems = this.orderedItems.filter(
        item => item.Pm_Id !== pmid
      );
    }
    this.orderedItems = [...this.orderedItems]


    if (formValue.KotQty != 0) {
      // 3️⃣ Create the new item // this allows for deleting the ordered item by entering 0 qty
      const newItem = {
        ...element,
        KotQty: formValue.KotQty,
        ItemComment: formValue.ItemComment
      };

      // 5️⃣ Add the new version
      this.orderedItems.push(newItem);

    }

    console.log('orderedItems', this.orderedItems);
  }


  // addItem(index: number, element: any): void {
  //   const formValue = this.items.at(index).value;
  //   if (!formValue.KotQty || formValue.KotQty === 0) {
  //     this.sweetAlert.show('error', 'Qty Required', 'error')
  //   }

  //   element.KotQty = formValue.KotQty;
  //   element.ItemComment = formValue.ItemComment

  //   // console.log('Selected Item:', formValue);
  //   // console.log('Selected element:', element);

  //   if (this.orderedItems.length === 0) {
  //     this.orderedItems.unshift(element)
  //   } else {


  //     this.orderedItems.push(element)
  //   }

  //   console.log('this.orderedItems.length', this.orderedItems)
  // }
}
