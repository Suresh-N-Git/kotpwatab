import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SharedMaterialModule } from './SharedMaterialModule';
import { HomeService } from './homeservice/home.service';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedMaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
isLoading: Subject<boolean>;
  subscription: Subscription = new Subscription();

  constructor(
    public homeService: HomeService,
    private router: Router,
    private changDetectorRef: ChangeDetectorRef,
  ) { }

  title = 'kotpwatab';


   ngOnInit(): void {
    this.isLoading = this.homeService.isLoading;
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          // this.homeService.show();  // This show is not needed as we are now checking locally for routes
        } else if (event instanceof NavigationEnd) {
          // this.homeService.hide() This hide is not needed as we are now checking locally for routes
        } else if (event instanceof NavigationCancel) {

          this.homeService.hide()
        } else if (event instanceof NavigationError) {

          this.homeService.hide()
        }
        this.changDetectorRef.detectChanges();
      })
    )
  }
}


