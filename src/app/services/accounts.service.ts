import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountsService {
    token:any = localStorage.getItem("MedicalToken");
        httpOptions:any = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer ' +this.token
            }).set("ngrok-skip-browser-warning", "true")
    };
    
    url:any
    constructor(private _HttpClient:HttpClient) {
      if(localStorage.getItem('url')==null){
        this.url = environment.baseUrl
      }else{
        this.url = ''
        this.url = 'https://'+localStorage.getItem('url')
      }
    }
    configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}

    
   // SupNames
   addnewAccount(Model:any){ 
    return this._HttpClient.post(this.url+'Account/AddNewAccount',Model)
  } 
  AddSupAccount(Model:any){
    return this._HttpClient.post(this.url+'Account/AddSubAccount',Model)
  }
  AddCreditNote(Model:any){
    return this._HttpClient.post(this.url+'Transactions/AddCreditNote',Model)
  }
  AddDebitNote(Model:any){
    return this._HttpClient.post(this.url+'Transactions/AddDebitNote',Model)
  }
  getAllAccounts(){
    return this._HttpClient.get(this.url+'Account/GetAllAccounts',this.configGet)
  }
  GetAllAccountsForRecieptAndPayments(){
    return this._HttpClient.get(this.url+'Account/GetAllAccountsForRecieptAndPayments',this.configGet)
  }
  GetSubAccountOfSpecificMain(id:any){
    return this._HttpClient.get(this.url+'Account/GetSubAccountOfSpecificMain?mainId='+id,this.configGet)
  }
  Delete(id:any){
    return this._HttpClient.delete(this.url+'Account/DeletAccount?id='+id,{responseType:'text'})
  }
  UpdateAccount(Model:any){
    return this._HttpClient.put(this.url+'Account/UpdateAccount',Model)
  }
  GetAllInsurerForAccount(accountId:any){
    return this._HttpClient.get(this.url+'Account/GetAllInsurerForAccount?accountId='+accountId,this.configGet)
  }

   // Files
  //  Customers File
  GetCustomerTemplete(customertype:any){
    return this._HttpClient.get(this.url+'Files/GetCustomerTemplete?customerType='+customertype,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  UploadeCustomerFile(body:any){
    return this._HttpClient.post(this.url+'Customers/UploadeCustomerFile',body,{responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")
  })
  //  ChartofAccount Files
  }
   GetChartofAccountTemplete(){
    return this._HttpClient.get(this.url+'Files/GetChartOfAccountsTemplete',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  UploadChartofAccountTemplete(body:any){
    return this._HttpClient.post(this.url+'Account/UploadChartOfAccounts',body,{responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")
  })
  }

}
