import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  token:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
  };
  baseUrl:any
  // baseUrl="http://97.74.82.75:1213/api/";
  // baseUrl="https://6f67-197-36-128-161.ngrok-free.app/api/"
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }

  public getCustomerFile(id:any, type:any){
    return this._HttpClient.get(this.baseUrl+'Files/DownloadCustomerFile?CustomerID='+id+'&type='+type,
    {observe:'response',
    responseType: 'blob'})
  }

  public DownloadPlanFile(id:any){
    return this._HttpClient.post(this.baseUrl+'Plan/DownloadPlanFile?smeRegistrationId='+id,null,
    {observe:'response',
    responseType: 'blob'})
  }
   //  CurrencyExchangeRate File
  // Download
  GetCurrencyExchangeRateTemplete(){
    return this._HttpClient.get(this.baseUrl+'ExchangeRate/GetExchangeRateTemplete',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '+this.token
      }).set("ngrok-skip-browser-warning", "true")})
  }
  // Upload
  UploadeCurrencyExchangeRateTemplete(body:any){
    return this._HttpClient.post(this.baseUrl+'ExchangeRate/AddExchangeRate',body,{responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+this.token
      }).set("ngrok-skip-browser-warning", "true")
    })
  }

   GetAccountingRecordReport(data:any){
    let params = new HttpParams();
    params =params.append('From',data?.from).append('To',data?.to)
    return this._HttpClient.get(this.baseUrl+'Reports/GetAccountingRecordReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({}).set("ngrok-skip-browser-warning", "true")})
  }
  GetBalanceTrailReport(data:any){
    let params = new HttpParams();
    params =params.append('From',data?.from).append('To',data?.to)
    return this._HttpClient.get(this.baseUrl+'Reports/GetOpeningBalanceReport',{observe:'response',
    params,
    responseType: 'blob',headers: new HttpHeaders({}).set("ngrok-skip-browser-warning", "true")})
  }





 
}
