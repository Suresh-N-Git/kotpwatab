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
  selector: 'app-uploadkot',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule, SharedDirectiveModule],
  templateUrl: './uploadkot.component.html',
  styleUrl: './uploadkot.component.scss'
})
export class UploadkotComponent implements OnInit {

  loginName: string;
  servicedBy: string;
  subscription: Subscription = new Subscription();

  orderedItems: any[] = [];

  txtTableNo = new FormControl('');

  txtServicedBy = new FormControl('');


  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    private sweetAlert: SweetalertService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }
  ngOnInit(): void {
    this.loginName = sessionStorage.getItem('ssLoginName') || '';
    this.servicedBy = sessionStorage.getItem('ssServicedBy') || '';

    console.log('this.this.loginName', this.loginName)
    console.log('this.this.servicedBy', this.servicedBy)

    this.orderedItems = JSON.parse(
      sessionStorage.getItem('ssOrderedItems') || '[]'
    ).map((item: any) => ({
      ...item,
      KotQty: Number(item.KotQty)
    }));

    this.txtServicedBy.setValue(this.servicedBy)

    console.log('this.orderedItems', this.orderedItems)
  }

  trackByPmId(_: number, item: any): number {
    return item.Pm_Id;
  }

  onQtyChange(item: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const qty = Number(value);

    if (isNaN(qty) || qty < 0) {
      // rollback or ignore
      input.value = item.KotQty;
      return;
    }

    if (qty === 0) {
      this.removeOrderedItem(item.Pm_Id);
      return;
    }

    const idx = this.orderedItems.findIndex(
      i => i.Pm_Id === item.Pm_Id
    );

    if (idx !== -1) {
      this.orderedItems[idx].KotQty = qty;
      this.persistOrderedItems();
    }
  }

  confirmRemoveItem(item: any): void {
    this.sweetAlert
      .confirm(
        'Remove Item?',
        `${item.Description} --  QTY --  ${item.KotQty}`
      )
      .then(res => {
        if (res.isConfirmed) {
          this.removeOrderedItem(item.Pm_Id);
        }
      });
  }

  removeOrderedItem(pmid: number): void {
    this.orderedItems = this.orderedItems.filter(
      item => item.Pm_Id !== pmid
    );

    this.persistOrderedItems();
  }

  private persistOrderedItems(): void {
    this.orderedItems = [...this.orderedItems];
    sessionStorage.setItem(
      'ssOrderedItems',
      JSON.stringify(this.orderedItems)
    );
  }

  onCommentChange(item: any, event: Event): void {
    const input = event.target as HTMLInputElement;
    const comment = input.value ?? '';

    const idx = this.orderedItems.findIndex(
      i => i.Pm_Id === item.Pm_Id
    );

    if (idx !== -1) {
      this.orderedItems[idx].ItemComment = comment;
      this.persistOrderedItems();
    }
  }


  uploadKot(): void {
    if (this.orderedItems.length === 0) {
      this.sweetAlert.show('Error', 'No items to upload', 'error');
      return;
    }

    const kotDItems = this.orderedItems.map(item => ({
      PmId: item.Pm_Id,
      KotQty: item.KotQty,
      ItemComment: item.ItemComment ?? ''
    }));

    let inputJSON = {
      TableNo: this.txtTableNo.value,
      ServicedBy: this.txtServicedBy.value,
      KoTBy: this.loginName,
      KotDItems: kotDItems
    }

    sessionStorage.setItem('ssServicedBy', this.txtServicedBy.value)
    console.log('inputJson ', inputJSON)

    this.subscription.add(
      this.homeService.upLoadKot(inputJSON).subscribe({
        next: (res: any) => {
          if (res === null) {
            res = [];
          }
          this.orderedItems = [];
          sessionStorage.removeItem('ssOrderedItems');

          this.txtTableNo.setValue(null);
          this.txtServicedBy.setValue(null);

          console.log('res', res)
          this.router.navigate(['dashboard']);
          this.sweetAlert.show('Success', res['Uploaded'], 'success')
        }, error: (error) => {
          this.sweetAlert.show('Error', error, "error")
        }
      })
    )
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
