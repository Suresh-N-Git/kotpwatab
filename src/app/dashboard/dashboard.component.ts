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


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  menuItemsAll: any = [];
  menuCategories: any = [];
  loginDetails: any;
  subscription: Subscription = new Subscription();
  serverDate: any;
  showCategories: boolean = false;


  private lastBack = 0;
  private exitDelay = 2000; // 2 seconds



  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    public sweetAlert: SweetalertService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails'));
    console.log('this.loginDetails ', this.loginDetails)
    let isoSystemDate = (this.loginDetails.SystemDate) ? new Date(this.loginDetails.SystemDate) : new Date();
    this.serverDate = ISODateToyyyyMMdd(isoSystemDate);
    this.menuItemsAll = JSON.parse(sessionStorage.getItem('ssMenuItems'));

    if (!this.menuItemsAll) {
      this.getDashboardDetails();
    } else {
      this.menuItemsAll = JSON.parse(sessionStorage.getItem('ssMenuItems'));
      this.menuCategories = [...new Set(this.menuItemsAll.map(item => item.Category))];
      console.log('his.menuCategories ', this.menuCategories)
      this.showCategories = true;
    }
  }


  getDashboardDetails(): void {

    let inputJSON =
    {
      FromApi: "GetMenuJson"
    };
    console.log('inputJSON', inputJSON)
    this.subscription.add(
      this.homeService.getMenuJson(inputJSON).subscribe({
        next: (res: any) => {
          if (res === null) {
            res = [];
          }
          this.menuItemsAll = res;

          if (this.menuItemsAll.length > 0) {
            sessionStorage.setItem('ssMenuItems', JSON.stringify(this.menuItemsAll));

            this.showCategories = true;
            this.menuCategories = [...new Set(this.menuItemsAll.map(item => item.Category))];

            console.log('this.menuCategories ', this.menuCategories)
          }
        }, error: (error) => {
          this.sweetAlert.show('Error', error, "error")
        }
      })
    )
  }


  selectedCategory(element): void {
    console.log('element'), element
    this.router.navigate(['takeorder'], { state: { catetgory: element} });
  }

  openUploadKot() : void {
    this.router.navigate(['uploadkot']);
  }

  openViewAllKot() : void {
    this.router.navigate(['viewallkot']);
  }
}
