import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  token:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
};
  // baseUrl="http://97.74.82.75:1213/api/";
  // baseUrl="https://6f67-197-36-128-161.ngrok-free.app/api/"
  baseUrl:any
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  constructor(private _HttpClient:HttpClient) { 
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }
            /// Commission Types
  getBenefitsTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetBenefitsTypes' ,this.httpOptions)
  }
            /// Relationshipes 
  getRelationshipes(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetRelationshipes' ,this.httpOptions)
  }
            /// Get MaritalStatus 
  getMaritalStatus(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetMaritalStatus' ,this.httpOptions)
  }
            /// Get Military Status 
  GetMilitaryStatus(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetMilitaryStatus' ,this.httpOptions)
  }
           /// Get RelationShips
  getRelationShips(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetRelationshipes' ,this.httpOptions)
  }
           /// Get Diseases
  getDiseases(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetDiseases' ,this.httpOptions)
  }
           /// Get Diseases
  EgyptCities(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetEgyptCities' ,this.httpOptions)
  }
           /// Get Diseases
  getDangerLevels(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetDangerLevels',this.httpOptions)
  }
           /// Get Search Date Types
  GetSearchDateTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetSearchDateTypes',this.httpOptions)
  }
  getCurrencies(){
    return this._HttpClient.get(this.baseUrl+'Lists/Currencies',this.configGet)
  }
  /// Customer Types
  getCustomerTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/RecievableInvoice' ,this.configGet)
  }
  getCustomerTypes2(){
    return this._HttpClient.get(this.baseUrl+'Lists/CustomerTypes' ,this.configGet)
  }
            /// Countries
  getCountries(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetCounties' ,this.configGet)
  }
  getSmallCountries(){
    return this._HttpClient.get(this.baseUrl+'Lists/CountriesValues',this.configGet)
  }
  getEmirates(){
    return this._HttpClient.get(this.baseUrl+'Lists/Emirates',this.configGet)
  }


   // Suppliers
   AddNewSupplier(Body:any){
    return this._HttpClient.post(this.baseUrl+'Supplier/NewSupplier',Body)
  }
  EditSupplier(Body:any){
    return this._HttpClient.put(this.baseUrl+'Supplier/UpdateSupplier',Body)
  }
  GetAllSuppliers(){
    return this._HttpClient.get(this.baseUrl+'Supplier/GetAllSuppliers',this.configGet)
  }
  GetSupplierById(id:any){
    return this._HttpClient.get(this.baseUrl+'Supplier/GetSupplierById?id='+id,this.configGet)
  }
 

  //InvoiceCustomerTypes
  getInvoiceCustomerTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/InvoiceCustomerTypes',this.configGet)
  }
}
