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


  outletList: any = [];
  loginDetails: any;
  subscription: Subscription = new Subscription();
  serverDate: any;
  showOutletData: boolean = false;

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
    this.getDashboardDetails();

    // if (sessionStorage.getItem('ssoutletList')) {
    //   this.outletList = JSON.parse(sessionStorage.getItem('ssoutletList'));
    //   if (this.outletList.length > 0) {
    //     // this.setupDataTable();
    //   }
    // } else {
    //   this.getOutletList();
    // }
  }


  getDashboardDetails(): void {

    let inputJSON =
    {
      FromApi: "OutletListDashBoard",
      Pc_GuId: this.loginDetails?.Pc_GuId,
      Login_Id: this.loginDetails?.Login_Id
    };
    console.log('inputJSON', inputJSON)
    this.subscription.add(
      this.homeService.genericAPI(inputJSON).subscribe({
        next: (res: any) => {
          if (res === null) {
            res = [];
          }
          this.outletList = res;
          if (this.outletList.length > 0) {
            sessionStorage.setItem('ssoutletList', JSON.stringify(this.outletList));
            console.log('this.outletList ', this.outletList)
            this.showOutletData = true;

            // this.setupDataTable();
          }
        }, error: (error) => {
          this.sweetAlert.show('Error', error, "error")
        }
      })
    )
  }

  outletSelected(element) : void {

    this.sweetAlert.show("Success", JSON.stringify(element), "success")
    console.group(element)
  }

  stockList(element) : void {
    console.log('element'), element
    this.router.navigate(['stocks'], { state: { outletId: element.Outlet_Id, outletName : element.Name } });
  }
}
