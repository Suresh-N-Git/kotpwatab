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


  openKots: any[] = [];

  ngOnInit(): void {
    this.openKots = [
      {
        "Kot No": 100804,
        "Table": "44",
        "ServicedBy": "hhhhh",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Bejois Brandy 1000Ml",
            "Qty": 1
          }
        ]
      },
      {
        "Kot No": 100805,
        "Table": "666",
        "ServicedBy": "yyyy",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Bejois Brandy 1000Ml",
            "Qty": 1
          },
          {
            "SlNo": 2,
            "PartDescription": "Amstel Strong 650Ml",
            "Qty": 2
          },
          {
            "SlNo": 3,
            "PartDescription": "Becks Beer 500Ml",
            "Qty": 2
          }
        ]
      },
      {
        "Kot No": 100808,
        "Table": "Bbb",
        "ServicedBy": "Dd",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Andra Chilly Chicken",
            "Qty": 1
          },
          {
            "SlNo": 2,
            "PartDescription": "Babycorn Manchurian",
            "Qty": 2
          }
        ]
      },
      {
        "Kot No": 100811,
        "Table": "ddd",
        "ServicedBy": "ddd",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "100 Pipers 12 Years Whisky 750Ml",
            "Qty": 1
          }
        ]
      },
      {
        "Kot No": 100812,
        "Table": "ff",
        "ServicedBy": "ddd",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Becks Beer 500Ml",
            "Qty": 1
          }
        ]
      },
      {
        "Kot No": 100807,
        "Table": "kestrel",
        "ServicedBy": "Suresh",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Amstel Strong 650Ml",
            "Qty": 1
          }
        ]
      },
      {
        "Kot No": 100806,
        "Table": "T1",
        "ServicedBy": "zzzz",
        "KotItems": [
          {
            "SlNo": 1,
            "PartDescription": "Bangalore Gin 180Ml",
            "Qty": 1
          },
          {
            "SlNo": 2,
            "PartDescription": "Amruth Rum 180Ml",
            "Qty": 1
          }
        ]
      }
    ]


  }
}
