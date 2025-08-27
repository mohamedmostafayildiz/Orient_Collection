import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  url:any 
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private _HttpClient:HttpClient){
    if(localStorage.getItem('url')==null){
      this.url = environment.baseUrl
    }else{
      this.url = ''
      this.url = 'https://'+localStorage.getItem('url')
    }
  }

  // Files
  GetLegacyDetailsTemplete(){
    return this._HttpClient.get(this.url+'Files/GetLegacyDetailsTemplete',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  getInvoiceReports(EndPoint:any,id:any){
    return this._HttpClient.get(this.url+'Transactions/'+EndPoint+'?legacyrecordId='+id,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  getFilledInvoiceReports(EndPoint:any,id:any){
    return this._HttpClient.get(this.url+'Transactions/'+EndPoint+'?invoiceId='+id,{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  NewInvoiceFileWay(Body:any){
    return this._HttpClient.post(this.url+'Transactions/NewInvoice',Body,{headers: new HttpHeaders({
        'Authorization': 'Bearer '
    }).set("ngrok-skip-browser-warning", "true")})
  }
  UploadLegacyDetailsTemplete(body:any){
    return this._HttpClient.post(this.url+'Files/UploadLegacyDetailsTemplete',body,{responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")
  })
  }

  // Application
  AddNewFilledInvoice(Body:any){
    return this._HttpClient.post(this.url+'Transactions/NewFilledInvoice',Body,this.ConfigPost)
  }
  GetAllFilledInvoices(CustomerType:any){
    return this._HttpClient.get(this.url+'Transactions/GetAllFilledInvoices?customerType='+CustomerType,this.configGet)
  }
  GetFilledInvoiceById(id:any){
    return this._HttpClient.get(this.url+'Transactions/GetFilledInvoiceById?invoiceId='+id,this.configGet)
  }

  // Journal Voucher
  GetAllVouchers(){
    return this._HttpClient.get(this.url+'Transactions/GetAllVouchers',this.configGet)
  }
  NewFilledJournalVoucher(Body:any){
    return this._HttpClient.post(this.url+'Transactions/NewFilledJournalVoucher',Body,this.ConfigPost)
  }
  GetJournalVoucherFile(){
    return this._HttpClient.get(this.url+'Files/GetJournalVoucherTemplete',{observe:'response',
      responseType: 'blob',headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")})
  }
  UploadJournalVoucherFile(body:any){
    return this._HttpClient.post(this.url+'Files/AddJournalVoucherByFile',body,{responseType: 'json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer '
      }).set("ngrok-skip-browser-warning", "true")
  })
  }




  /// new add for invoice in 24//11
  GetAccountsForInvoic(CustomerType:any){
    return this._HttpClient.get(this.url+'Customers/GetCustomersForInvoic?customerType='+CustomerType,this.configGet)
  }
  GetSubAccountOfSpecificMain(MainId:any){
    return this._HttpClient.get(this.url+'Account/GetSubAccountOfSpecificMain?mainId='+MainId,this.configGet)
  }

     // Suppliers
   AddNewSupplier(Body:any){
    return this._HttpClient.post(this.url+'Customers/NewSupplier',Body)
  }
  EditSupplier(Body:any){
    return this._HttpClient.put(this.url+'Customers/UpdateSupplier',Body)
  }
  GetAllSuppliers(){
    return this._HttpClient.get(this.url+'Supplier/GetAllSuppliers',this.configGet)
  }
  GetSupplierById(id:any){
    return this._HttpClient.get(this.url+'Supplier/GetSupplierById?id='+id,this.configGet)
  }
}

