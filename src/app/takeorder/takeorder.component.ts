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

  loginName: string;
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
    this.loginName = sessionStorage.getItem('ssLoginName') || '';

    const isoSystemDate = this.loginDetails.SystemDate
      ? new Date(this.loginDetails.SystemDate)
      : new Date();

    this.serverDate = ISODateToyyyyMMdd(isoSystemDate);
    this.orderedItems = JSON.parse(sessionStorage.getItem('ssOrderedItems') || '[]');

    this.menuItemsAll = JSON.parse(sessionStorage.getItem('ssMenuItems') || '[]');

    if (this.selCategory != 'All Categories') {
      this.menuItemsByCategories =
        this.menuItemsAll.filter(item => item.Category === this.selCategory);
    }
    else {
      this.menuItemsByCategories = [...this.menuItemsAll]
    }

    // 🔹 Initial filtered list
    this.filteredMenuItems = [...this.menuItemsByCategories];

    // 🔹 Search subscription
    this.searchControl.valueChanges.subscribe(searchText => {
      this.applySearch(searchText);
    });

    // 🔹 Build reactive form AFTER data is ready
    this.buildForm();
  }

  // Reactive Form Builders

  private buildForm(): void {
    const itemsGroup: { [key: string]: FormGroup } = {};

    this.menuItemsByCategories.forEach(item => {
      itemsGroup[item.Pm_Id] = this.createItemForm(item);
    });

    this.orderForm = this.fb.group({
      items: this.fb.group(itemsGroup)
    });
  }


  private createItemForm(item: any): FormGroup {
    return this.fb.group({
      KotQty: [item.KotQty ?? null],
      ItemComment: [item.ItemComment ?? '']
    });
  }

  trackByPmId(_: number, item: any): number {
    return item.Pm_Id;
  }

  private applySearch(searchText: string): void {
    const text = (searchText || '').toLowerCase();

    this.filteredMenuItems = this.menuItemsByCategories.filter(item =>
      item.Description.toLowerCase().includes(text)
    );
  }

  getItemForm(pmid: number): FormGroup {
    return this.orderForm.get(['items', pmid.toString()]) as FormGroup;
  }

  addItem(element: any): void {
    const pmid = element.Pm_Id;
    const formGroup = this.getItemForm(pmid);
    const { KotQty, ItemComment } = formGroup.value;

    if (KotQty === null || KotQty === undefined) {
      this.sweetAlert.show('error', 'Qty Required', 'error');
      return;
    }

    // Capture previous state
    const previousItem = this.orderedItems.find(i => i.Pm_Id === pmid);
    const previousQty = previousItem?.KotQty ?? null;

    // -------- QTY = 0 FLOW --------
    if (KotQty == 0) {
      this.sweetAlert
        .confirm('Proceed ?', `${element.Description} Will Be Cancelled?`)
        .then(res => {
          if (res.isConfirmed) {

            // Remove ONLY this item
            this.orderedItems = this.orderedItems.filter(
              item => item.Pm_Id !== pmid
            );

            // Reset form
            formGroup.patchValue({ KotQty: null });

          } else {

            // Restore previous qty
            formGroup.patchValue({ KotQty: previousQty });

          }

          this.orderedItems = [...this.orderedItems];
          console.log('this.orderedItems after cancel', this.orderedItems)
          sessionStorage.setItem(
            'ssOrderedItems',
            JSON.stringify(this.orderedItems)
          );
        });

      return;
    }

    // -------- NORMAL ADD / UPDATE FLOW --------
    // Remove the Pm_Id if already present
    this.orderedItems = this.orderedItems.filter(
      item => item.Pm_Id !== pmid
    );

    this.orderedItems.push({
      ...element,
      KotQty,
      ItemComment
    });

    this.orderedItems = [...this.orderedItems];
    console.log('this.orderedItems after Add/ Edit', this.orderedItems)
    sessionStorage.setItem(
      'ssOrderedItems',
      JSON.stringify(this.orderedItems)
    );
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}