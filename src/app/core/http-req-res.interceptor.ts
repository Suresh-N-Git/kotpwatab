import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../homeservice/home.service';
import { HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, finalize } from 'rxjs/operators';

export const HttpReqResInterceptor: HttpInterceptorFn = (req, next) => {
  const homeService = inject(HomeService);
  const route = inject(Router);

  homeService.show();  // Show the spinner

  let loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails')!);
 
  if (loginDetails) {
      if (req.url.toLowerCase() == 'http://localhost:9000/') {
      } else {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${loginDetails.token}`
          }
        });
      }
  }

  return next(req).pipe(
    delay(1000),
    finalize(() => homeService.hide()),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error instanceof HttpErrorResponse) {
        if (!navigator.onLine) {
          errorMessage = 'No Internet Connection';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized or Session Timed Out. Kindly Re-Login';
          route.navigate(['/login']);
          sessionStorage.clear();
        } else if (error.status === 404) {
          errorMessage = 'Not Found';
        } else if (error.status === 500) {
          errorMessage = error.error?.title || 'Server Error';
        } else if (error.status === 0) {
          errorMessage = 'Server is unreachable or under maintenance';
        } else {
          errorMessage = error.error?.message || error.message || 'Unknown error';
        }
      } else {
        errorMessage = 'Unknown Error..! Please Try Again.';
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};

