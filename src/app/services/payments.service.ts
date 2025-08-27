import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

 
   token:any = localStorage.getItem("MedicalToken");
   httpOptions:any = {
       headers: new HttpHeaders({
         'Authorization': 'Bearer ' +this.token
       }).set("ngrok-skip-browser-warning", "true")
   };
   baseUrl:any
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


    AddNewReciept(body:any){
      return this._HttpClient.post(this.baseUrl+'Payments/NewReciept',body,this.httpOptions)
    }
    AddNewPayment(body:any){
      return this._HttpClient.post(this.baseUrl+'Payments/NewPayment',body,this.httpOptions)
    }
    GetAllBanksToPay(){
      return this._HttpClient.get(this.baseUrl+'Payments/GetAllBanksToPay',this.httpOptions)
    }
    GetAllPaymentways(){
      return this._HttpClient.get(this.baseUrl+'Lists/PaymenWays',this.httpOptions)
    }
 
}
