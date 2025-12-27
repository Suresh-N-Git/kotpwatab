import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // themeMode = new Subject<boolean>();  // No need for it to be a subject as we are not subscribing to it
  themeMode!: boolean;
  reportData: Subject<any> = new Subject();
  receiptData: Subject<any> = new Subject();
  isPrinting: Subject<any> = new Subject();
  isLoading: Subject<boolean> = new Subject();


  outletSelected: Subject<boolean> = new Subject();
  // private boolSubject: Subject<boolean>;
  // barChartMode = new Subject<boolean>();

  // baseURLCommon: string = environment.baseURL + 'Common/';
  // If we use the above there could be a problem changing it during testing and then updating it in the server
  // So I have used a separate file epdate (End Point Data) which is in the assets directory and need not 
  // be updated even when the web site is updated
  ddMMyyyyRegEx: any = environment.ddMMyyyyRegEx;
  ddMMyyyyRegEx2: any = environment.ddMMyyyyRegEx2;
  emailPattern: any = environment.emailpattern;
  ayStartMonths: any = environment.ayStartMonths;
  cashbank: any = environment.cashbank;
  ifsc: any = environment.ifsc;
  gstRegEx: any = environment.gstregex;
  statecodes =  environment.statecodes;
  baseURLCommon: string = sessionStorage.getItem('baseURL')!;
  tallyUrl: string = 'http://' + localStorage.getItem('tallyComputerName') + ":50010/common/";
 // tallyUrl: string = 'http://localhost/TallyBridge/common/'
  //tallyUrl: string = 'http://localhost:50010/common/'

  yesno: any = environment.yesno;
  
   private requestCount = 0;  // to keep the spinner on for daisy chained api calls and also parallel calls till the last API

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe) { }

  //https://stackoverflow.com/questions/54682011/how-to-create-getter-setter-in-angular
  // getters and setters in angular service. The name of the functions must be the same

  //// Start For Dark Light Mode
  set ThemeMode(val: boolean) {
    localStorage.setItem('poslThemeDark', '' + val)
    this.themeMode = JSON.parse(localStorage.getItem('poslThemeDark')!)
  }

  get ThemeMode(): boolean {
    this.themeMode = JSON.parse(localStorage.getItem('poslThemeDark')!)
    return this.themeMode;
  }

  //// Start For Spinner 
 show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.isLoading.next(true); // Show only on first request
    }
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.isLoading.next(false); // Hide only when all are done
    }
  }

  // hide() {
  //   this.isLoading.next(false);
  // }
  //// End For Spinner

  getepData() {
    //https://www.techiediaries.com/angular-local-json-files/ 
    // how to read an external json file from assets directory .epdata.json is endpointdata
    return this.http.get("assets/epdata.json").pipe(map(res => {
      return res;
    }));
  }
  // // End of  read endpoint data from external file in assets directory

  getAssetsJsonFile(fileName: string) {
    //https://www.techiediaries.com/angular-local-json-files/ 
    // how to read an external json file from assets directory .epdata.json is endpointdata
    let fileToGet = "assets/" + fileName + ".json"
    return this.http.get(fileToGet).pipe(map(res => {
      return res;
    }));
  }

  getAssetsFile(fileName: string) {
    //https://www.techiediaries.com/angular-local-json-files/ 
    // how to read an external json file from assets directory .epdata.json is endpointdata
    let fileToGet = "assets/" + fileName
    return this.http.get(fileToGet, { responseType: 'text' }).pipe(map(res => {
      return res;
    }));
  }

  getAssetImage(fileName: string) {
    // https://stackoverflow.com/questions/56686802/getting-image-from-assets-and-converting-it-to-base64
    let fileToGet = "assets" + fileName
    // To get the image read form folder we have to describe response type as blob
    return this.http.get(fileToGet, { responseType: 'blob' })
      .pipe(map(res => {
        return res;
      }));
  }
  
  // // All http Calls from below using the end point in epData.json

  getHelloWorld() {
    // This returns text and not JSON and hence responseType is declared as text, 
    // since default responseType is JSON and hence we normally do not mention it
    // Return type by default is observable body only. If we want full response for ex to read header
    // we need to specify observe: 'response'
    return this.http.get(this.baseURLCommon + 'HelloWorld',
      { 'headers': new HttpHeaders({ 'Content-Type': 'application/json' }), 'responseType': 'text', observe: 'response' }).pipe
      (map((res: any) => {
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // console.log('res.body ', res.body);
        return res.body;
      }));
  }

  validateLogin(username: any, password: any) {
    // We use { observe: 'response' } when we want to get the full response inculding headers
    // Default if you do not use it only the body will be returned in the observer
    const jsonObject = { UserName: username, Password: password }
    console.log('validateLogin ', jsonObject)
    return this.http.post(this.baseURLCommon + 'ValidateLogin', jsonObject, { observe: 'response' })
      .pipe
      (map(res => {
        // below is the way to read the header keys, if allowed to be read by settings in the API at server
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // We need to return only the body where the data is used in the UI
        return res.body;
      }));
  }

    getMenuJson(inputJson: any) {
    // We use { observe: 'response' } when we want to get the full response inculding headers
    // Default if you do not use it only the body will be returned in the observer
  
    console.log('getMenuJson ', inputJson)
    return this.http.post(this.baseURLCommon + 'GetMenuJson', inputJson, { observe: 'response' })
      .pipe
      (map(res => {
        // below is the way to read the header keys, if allowed to be read by settings in the API at server
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // We need to return only the body where the data is used in the UI
        return res.body;
      }));
  }

   upLoadKot(inputJson: any) {
    // We use { observe: 'response' } when we want to get the full response inculding headers
    // Default if you do not use it only the body will be returned in the observer
  
    // console.log('getMenuJson ', inputJson)
    return this.http.post(this.baseURLCommon + 'UploadKotJson', inputJson, { observe: 'response' })
      .pipe
      (map(res => {
        // below is the way to read the header keys, if allowed to be read by settings in the API at server
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // We need to return only the body where the data is used in the UI
        return res.body;
      }));
  }

    openKotsPWA(inputJson: any) {
    // We use { observe: 'response' } when we want to get the full response inculding headers
    // Default if you do not use it only the body will be returned in the observer
  
    console.log('getOpenKotsPWA ', inputJson)
    return this.http.post(this.baseURLCommon + 'OpenKotsPWA', inputJson, { observe: 'response' })
      .pipe
      (map(res => {
        // below is the way to read the header keys, if allowed to be read by settings in the API at server
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // We need to return only the body where the data is used in the UI
        return res.body;
      }));
  }

  changePassword(resultJson: any) {
    return this.http.post(this.baseURLCommon + 'ChangePassword', resultJson).pipe(map(res => {
      return res;
    }));
  }

  verifyRoute(LoginId: string | number | boolean, RouteName: string | number | boolean) {
    let parameters = new HttpParams().set("LoginId", LoginId).set("RouteName", RouteName)
    return this.http.get(this.baseURLCommon + 'VerifyRoute', { params: parameters }).pipe(map(res => {
      // console.log('verifyRoute --> ', res)
      return res;
    }));
  }


  getMenusByLoginId(LoginId: string | number | boolean) {
    let parameters = new HttpParams().set("LoginId", LoginId)
    return this.http.get(this.baseURLCommon + 'MenuByLoginId', { params: parameters }).pipe(map(res => {
      return res;
    }));
  }

  getTableSchema(tablename: string) {
    let parameters = new HttpParams().set("tablename", tablename);
    return this.http.get(this.baseURLCommon + 'TableSchema', { params: parameters }).pipe(map(res => {
      return res;
    }));
  }

  // In the generia we use  { observe: 'response' } so as to read and save the server system date in loginDetails
  // and not depend on the local system date which may be wrong
 // In the generia we use  { observe: 'response' } so as to read and save the server system date in loginDetails
  // and not depend on the local system date which may be wrong
  genericAPI(resultJson: any) {
    return this.http.post(this.baseURLCommon + 'Generic', resultJson, { observe: 'response' })
    .pipe(map((res: HttpResponse<any>) => {
      let loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails') || '');
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      loginDetails['SystemDateHHMMSS'] = this.datePipe.transform(new Date(res.headers.get('date') || ''), "yyyy-MM-dd hh:mm:ss");
      loginDetails['SystemDate'] = this.datePipe.transform(new Date(res.headers.get('date') || ''), "yyyy-MM-dd");
      sessionStorage.setItem('ssLoginDetails', JSON.stringify(loginDetails));
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }

  genericNT(resultJson: any) {
    return this.http.post(this.baseURLCommon + 'GenericNT', resultJson, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => {
      let loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails') || '');
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      loginDetails['SystemDate'] = this.datePipe.transform(new Date(res.headers.get('date') || ''), "yyyy-MM-dd");
      sessionStorage.setItem('ssLoginDetails', JSON.stringify(loginDetails));
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }


   genericCompressedAPI(resultJson: any) {
    return this.http.post(this.baseURLCommon + 'GenericCompressed', resultJson, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => {
      let loginDetails = JSON.parse(sessionStorage.getItem('ssLoginDetails') || '');
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      loginDetails['SystemDate'] = this.datePipe.transform(new Date(res.headers.get('date') || ''), "yyyy-MM-dd");
      sessionStorage.setItem('ssLoginDetails', JSON.stringify(loginDetails));
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }


    globalFormSaveNT(formJsonData: FormData,  apiEndPoint: string) {//GlobalFormSave is end point
    return this.http.post(this.baseURLCommon + apiEndPoint, formJsonData, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => {
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }

    genericFromFormNTAPI(formJsonData: FormData) {//GlobalFormSave is end point
    return this.http.post(this.baseURLCommon + 'GenericFromFormNT', formJsonData, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => {
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }

   GenericFromForm(formJsonData: FormData) {//GlobalFormSave is end point
    return this.http.post(this.baseURLCommon + 'GenericFromForm', formJsonData, { observe: 'response' }).pipe(map((res: HttpResponse<any>) => {
      // console.log("Time Zone----------->", res.headers.get('date'), new Date(res.headers.get('date')));
      // Saved in yyyy-MM-dd format to easily use it with new Date() function in UI which requires input in this format
      // We need to return only the body where the data is used in the UI
      return res.body;
    }));
  }

  

  // <-- Report Starts -->
  getReportDDList(LoginId: string | number | boolean) {
    let parameters = new HttpParams().set("LoginId", LoginId)
    return this.http.get(this.baseURLCommon + 'ReportsList', { params: parameters }).pipe(map(res => {
      return res;
    }));
  }

  getReportInputData(Report_Id: string | number | boolean) {
    let parameters = new HttpParams().set("Report_Id", Report_Id)
    return this.http.get(this.baseURLCommon + 'ReportsInputData', { params: parameters }).pipe(map(res => {
      return res;
    }));
  }

  loadReportData(resultJSON: any) {
    return this.http.post(this.baseURLCommon + 'ReportLoad', resultJSON).pipe(map(res => {
      return res;
    }));
  }

  // // <-- For Tally Http -->
  IsTallyRunning() {
    let fullTallyUrl = this.tallyUrl + 'CallTally'
    return this.http.get(fullTallyUrl)
      .pipe(map((res: HttpResponse<any>) => {
        return res;
      }));
  }

  helloFromTallyBridge() {
    // This returns text and not JSON and hence responseType is declared as text, 
    // since default responseType is JSON and hence we normally do not mention it
    // Return type by default is observable body only. If we want full response for ex to read header
    // we need to specify observe: 'response'
    return this.http.get(this.tallyUrl + 'HelloWorld').pipe
      (map((res: any) => {
        // console.log('res.headers.keys ', res.headers.get('date'));
        // console.log('res.headers.keys ', res.headers.get('server'));
        // console.log('res.body ', res.body);
        return res;
      }));
  }

  // // This is a generic http call for all the EzySales ERP Calls to Tally
  postEzySalesGenericToTally(routeToCall: string, inputJSON: any) {
    let fullTallyUrl = this.tallyUrl + routeToCall
    return this.http.post(fullTallyUrl, inputJSON)
      .pipe(map((res: HttpResponse<any>) => {
        return res;
      }));
  }

  //   // This is a generic http call for all the EzyTally Calls to Tally
  //   // Same as above but keeping it seperatea as EzyTally will be another project
  postGenericToEzyTally(routeToCall: string, inputJSON: { [x: string]: string; }) {
    let fullTallyUrl = this.tallyUrl + routeToCall
    inputJSON['CallingApp'] = "EzySales"
    return this.http.post(fullTallyUrl, inputJSON)
      .pipe(map((res: HttpResponse<any>) => {
        return res;
      }));
  }
}


