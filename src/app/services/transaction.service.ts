import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {

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
      ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  // Transaction Report
  getTransactionReports(){
    return this._HttpClient.get(this.url+'Account/GetChartOfAccounts',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }

    // Transaction type
    AddNewType(name:any){
      return this._HttpClient.post(this.url+'Account/AddNewType?name='+name,this.ConfigPost)
    }
    UpdateType(Model:any){
      return this._HttpClient.put(this.url+'Account/UpdateType',Model)
    }
    GetAllTypes(){
      return this._HttpClient.get(this.url+'Account/GetAllTypes',this.configGet)
    }
    GetTypeById(id:any){
      return this._HttpClient.get(this.url+'Account/GetById?id='+id,this.configGet)
    }
    Delete(id:any){
      return this._HttpClient.delete(this.url+'Account/DeletAccount?id='+id,{responseType:'text'})
    }
    // Details
    AddNewDetails(Body:any){
      return this._HttpClient.post(this.url+'Account/AddNewDetails',Body,this.ConfigPost)
    }
    UpdateDetails(Model:any){
      return this._HttpClient.put(this.url+'Account/UpdateDetails',Model)
    }
      GetTrabsactionTemplete(){
    return this._HttpClient.get(this.url+'Collections/DownloadTrabsactionSheet',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
    UploadTransactionTemplete(body:any){
      return this._HttpClient.post(this.url+'Collections/AddTransactions',body,{responseType: 'json',
        headers: new HttpHeaders({
          'Authorization': 'Bearer '
        }).set("ngrok-skip-browser-warning", "true")
    })
  }



  //  GetAllReturnCheques(){
  //     return this._HttpClient.get(this.url+'Portfolio/ReturnCheques',this.configGet)
  //   }
     GetAllReturnCheques(data: any) {
    let params = new HttpParams();

    Object.keys(data).forEach(key => {
      const value = data[key];
      // ⛔ متبعتش القيم null, undefined, أو ''
      if (value !== null && value !== undefined && value !== '') {
        params = params.append(key, value);
      }
    });

  return this._HttpClient.get(this.url + 'Portfolio/ReturnCheques', {
    responseType: 'json',
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.token
    }).set("ngrok-skip-browser-warning", "true")
  });
}
   ConvertCheques(Body:any){
  return this._HttpClient.post(this.url + 'Portfolio/ConvertCheques', Body, {
    headers: this.ConfigPost.headers,
    responseType: 'text'
  });
}



}

  
