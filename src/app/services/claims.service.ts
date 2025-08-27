import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  // baseUrl="http://97.74.82.75:1213/api/"
  // baseUrl="https://fa10-197-36-86-72.ngrok-free.app/api/"
  baseUrl:any
  t:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
  };
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json')};
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }

      // Download Templete Claims File
  getClaimsTempleteFile(id:any){
    return this._HttpClient.get(this.baseUrl+'FileClaims/DownloadClaimsFile?policyId='+id,{observe:'response',
    responseType: 'blob',headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")})
  }
  getClaimsTempleteFileRE(){
    return this._HttpClient.get(this.baseUrl+'FileClaims/DownloadClaimsFile',{observe:'response',
    responseType: 'blob',headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")})
  }
  GetTpaTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetTPATypes',this.configGet)
  }
  // GetClaimExchangePermit
  GetClaimExchangePermit(code:any){
  return this._HttpClient.get(this.baseUrl+'Claims/GetClaimExchangePermit?claimCode='+code,this.httpOptions)
 }


          // Add Claim
  AddClaim(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Claims/GetFileClaim',FormData,this.httpOptions)
  }

  GetAllFileData(id:any){ 
    return this._HttpClient.get(this.baseUrl+'FileClaims/GetAllFileData?ExcelfileId='+id,this.httpOptions)
  }
  UpdateSatus(formData:any){
    return this._HttpClient.post(this.baseUrl+'FileClaims/SaveClaimAndFileClaim',formData,
      {headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")}
    )
  }

  GetAllClaimsPermits(){ 
    return this._HttpClient.get(this.baseUrl+'Claims/GetAllClaimsPermits',this.httpOptions)
  }
  
  GetFileDataByClaimCode(code:any){ 
    return this._HttpClient.get(this.baseUrl+'FileClaims/GetFileDataByClaimCode?claimCode='+code,this.httpOptions)
  }
  GetAllClaims(){ 
    return this._HttpClient.get(this.baseUrl+'Claims/GetAllClaims',this.httpOptions)
  }
  getPrinted(claimCode:any){
    return this._HttpClient.put(this.baseUrl+'Claims/Printed?claimCode='+claimCode,this.httpOptions)
  }
  RemoveExchangePermit(claimCode:any){
    return this._HttpClient.delete(this.baseUrl+'Claims/RemoveExchangePermit?claimExchangePermitId='+claimCode,  { 
      responseType: 'text', 
      ...this.httpOptions 
    })
  }

  // new 25/8
  // GetAllRejectedClaims(){ 
  //   return this._HttpClient.get(this.baseUrl+'',this.httpOptions)
  // }
  GetAllRejectedClaims(data:any){
    let params = new HttpParams();
    params = params.append('From',data?.from).append('To',data?.to).append('PolicyCode',data?.policyCode).append('TPAType',data?.tPAType);
    return this._HttpClient.get(this.baseUrl+'Claims/GetAllRejectedClaims',{
    params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.t
    }).set("ngrok-skip-browser-warning", "true")})
  }
  CreateClaimsDetailsReport(data:any){
    let params = new HttpParams();
    params = params.append('From',data?.from).append('To',data?.to).append('PolicyCode',data?.policyCode).append('TPAType',data?.tPAType);
    return this._HttpClient.get(this.baseUrl+'Report/CreateClaimsDetailsReport',{observe:'response',
    params,responseType: 'blob',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.t
    }).set("ngrok-skip-browser-warning", "true")})
  }

  LossRatioReport(data:any){
    let params = new HttpParams();
    params = params.append('PolicyCode',data.policyCode).append('OutStanding',data.outStanding ).append('IBNR',data.iBNR);
    return this._HttpClient.get(this.baseUrl+'Report/LossRatioReport',{observe:'response',
    params,responseType: 'blob',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.t
    }).set("ngrok-skip-browser-warning", "true")})
  }
  getPolicesWithSupCompanyId(){
    return this._HttpClient.get(this.baseUrl+'Policy/GetPoliciesWithSubCompanyData',this.httpOptions)
  }
  // SubCompaniesLossRatioReport(data:any){
  //   let params = new HttpParams();
  //   params = params.append('PolicyCode',data.policyCode).append('InsuredId',data.insuredId ).append('subCompanyData',encodeURIComponent(JSON.stringify(data.subdompanydata)));
  //   return this._HttpClient.get(this.baseUrl+'Report/SubCompaniesLossRatioReport',{observe:'response',
  //   params,responseType: 'blob',
  //   headers: new HttpHeaders({
  //     'Authorization': 'Bearer ' +this.t
  //   }).set("ngrok-skip-browser-warning", "true")})
  // }
  SubCompaniesLossRatioReportPut(Model:any){
    return this._HttpClient.put(this.baseUrl+'Report/SubCompaniesLossRatioReport',Model,{observe:'response'
      ,responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")})
  }
  UpdateStatusformRejectedtoconfirm(Body:any){
    return this._HttpClient.post(this.baseUrl+'FileClaims/UpdateSatus',Body,this.httpOptions)
  }
}
