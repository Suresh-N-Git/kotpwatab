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
  selector: 'app-viewallkot',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  templateUrl: './viewallkot.component.html',
  styleUrl: './viewallkot.component.scss'
})
export class ViewallkotComponent implements OnInit {

  subscription: Subscription = new Subscription();

  openKots: any[] = [];
  loginName: string;

  constructor(
    private router: Router,
    private location: Location,
    private homeService: HomeService,
    private sweetAlert: SweetalertService,
    private snackBar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    
    
    this.getMenuItems();
  }


  getMenuItems(): void {

    let inputJSON =
    {
      "FromApi": "OpenKotsPWA",
      "KoTBy": sessionStorage.getItem('ssLoginName') || ''
    };
    console.log('inputJSON', inputJSON)
    this.subscription.add(
      this.homeService.openKotsPWA(inputJSON).subscribe({
        next: (res: any) => {
          if (res === null) {
            res = [];

          }
          console.log("res" , res)
          this.loginName = sessionStorage.getItem('ssLoginName') || '';
          this.openKots = res;

          if (this.openKots.length == 0) {

            this.sweetAlert.show('Info', "No Open KoTs", "info")
          }
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
