import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppendixService {
  // baseUrl="http://97.74.82.75:1213/api/"
  // baseUrl="https://03b8-197-36-34-214.ngrok-free.app/api/"
  baseUrl:any
  t:any = localStorage.getItem("MedicalToken");
  httpOptions:any = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.t
      }).set("ngrok-skip-browser-warning", "true")
  };
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


  
  /////////////////  Appendix  /////////////////////////
  AddPolicyAppendix(formData:any){
    return this._HttpClient.post(this.baseUrl+'Endorsement/AddEnorsement',formData,this.httpOptions)
  } 
  reCalculateNetPremium(PolicyId:any, net:any){
    return this._HttpClient.get(this.baseUrl+'Policy/GetPolicyCalculationsWithNetPremium?policyId='+PolicyId+'&netPremium='+net,this.httpOptions)
  } 



  
  UpdateEndorsement(Body:any){
    return this._HttpClient.post(this.baseUrl+'Endorsement/FinalSaveEndorsement',Body,this.httpOptions)
  } 
  getEndorsementById(id:any){
    return this._HttpClient.get(this.baseUrl+'Endorsement/GetById?endorsementId='+id,this.httpOptions)
  }

      // Get Group Of Endorsement
  GetGroupOfEndorsement(id:any){
    return this._HttpClient.get(this.baseUrl+'CustomerGroup/GetGroupOfEndorsement?endorsementId='+id,this.httpOptions)
  }
  SaveEndorsement(EndorId:any){
    return this._HttpClient.put(this.baseUrl+'Endorsement/SaveEndorsement?endorsementId='+EndorId,null,this.httpOptions)
  }
}
  