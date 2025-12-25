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
    const formGroup = this.items.at(index);
    // const formValue = this.items.at(index).value;
    const formValue = formGroup.value;

    if (formValue.KotQty === null || formValue.KotQty === undefined) {
      this.sweetAlert.show('error', 'Qty Required', 'error');
      return;
    }

    // 1️⃣ Capture pmid BEFORE doing anything else
    const pmid = element.Pm_Id;

    // Capture previous qty BEFORE doing anything
    const previousItem = this.orderedItems.find(i => i.Pm_Id === pmid);
    const previousQty = previousItem?.KotQty ?? null;

  
    if (formValue.KotQty == 0) {
        // -------- QTY = 0 FLOW --------
      this.sweetAlert.confirm('Proceed ?', element.Description + ' Will Be Cancelled?')
        .then(res => {
          if (res.isConfirmed) {

            // Remove ONLY this item
            this.orderedItems = this.orderedItems.filter(
              item => item.Pm_Id !== pmid
            );

            // 🔑 Reset form qty to null
            formGroup.patchValue({ KotQty: null });

          } else {
            // 🔑 Restore previous qty
            formGroup.patchValue({ KotQty: previousQty });
          }
          // Trigger change detection safely
          this.orderedItems = [...this.orderedItems];
          console.log('orderedItems', this.orderedItems);
          sessionStorage.setItem('ssOrderedItems', JSON.stringify(this.orderedItems));
        });

      return;
    } 
    else {
      // -------- NORMAL ADD / UPDATE FLOW --------
      // 2️⃣ Remove ONLY the matching item
      if (pmid !== undefined && pmid !== null) {
        this.orderedItems = this.orderedItems.filter(
          item => item.Pm_Id !== pmid
        );
      }
      this.orderedItems = [...this.orderedItems]
      const newItem = {
        ...element,
        KotQty: formValue.KotQty,
        ItemComment: formValue.ItemComment
      };
      // 5️⃣ Add the new version
      this.orderedItems.push(newItem);
      this.orderedItems = [...this.orderedItems];
      sessionStorage.setItem('ssOrderedItems', JSON.stringify(this.orderedItems));
    }
    console.log('orderedItems', this.orderedItems);
  }
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




// if (formValue.KotQty == 0) {
//   this.sweetAlert.confirm('Proceed ?', '0 Qty Item Will Be Removed?')
//     .then(res => {
//       if (res.isConfirmed) {
//         // 2️⃣ Remove ONLY the matching item
//         if (pmid !== undefined && pmid !== null) {
//           this.orderedItems = this.orderedItems.filter(
//             item => item.Pm_Id !== pmid
//           );
//         }
//         this.orderedItems = [...this.orderedItems]
//         console.log('After deletion  orderedItems', this.orderedItems);
//         return;
//         // this.sweetAlert.show('Confirmed', 'Action executed successfully!', 'success');
//       } else {

//         return;
//       }
//     });
// } 