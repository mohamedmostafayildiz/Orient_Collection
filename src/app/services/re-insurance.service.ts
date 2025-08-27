import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReInsuranceService {

  baseUrl:any
  token:any = localStorage.getItem("MedicalToken");
      httpOptions:any = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' +this.token
          }).set("ngrok-skip-browser-warning", "true")
  };
  
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
   }

  AddNewReInsuranceCompany(Model:any){
    return this._HttpClient.post(
      this.baseUrl + 'CompanyAndBroker/AddCompanyOrBrokerReInsurance',
      Model,
      { responseType: 'text' }
    );
  }
  // UY
  GetAllUnderWritingYears(){
    return this._HttpClient.get(this.baseUrl+'Treaty/GetAllUnderWritingYears',this.httpOptions)
  }
  // From and To
  getFromAndTo(name:any ,period:any){
    return this._HttpClient.get(this.baseUrl+'Treaty/GetDatesOfPeriod?treatyId='+name+'&period='+period,this.httpOptions)
  }
  // Querters
  GetAvailablePeriodsForOutstanding(){
    return this._HttpClient.get(this.baseUrl+'ReInsuranceTreatySetUp/GetAvailablePeriodsForOutstanding',this.httpOptions)
  }
  // Get All Treaties Names
  // GetAllTreatiesNames(uy:any){
  //   return this._HttpClient.get(this.baseUrl+'ReInsuranceTreatySetUp/GetAllTreatiesNames?UnderWriting='+uy,this.httpOptions)
  // }
  GetAllTreatiesNames(uy:any){
    return this._HttpClient.get(this.baseUrl+'Treaty/GetTreatiesWithReInsurances?UnderWriting='+uy,this.httpOptions)
  }
  GetAllPeriodes(teratyId:any){
    return this._HttpClient.get(this.baseUrl+'Treaty/GetPeriods?TreatyId='+teratyId,this.httpOptions)
  }
  // SOA And Bordereaux Types
  SOAAndBordereauxTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/SOAAndBordereauxTypes',this.httpOptions)
  }
  // ReInsurance , Broker , period
  GetTreatyReInsuranceAndBrokerAndPeriods(treatyName:any){
    return this._HttpClient.get(this.baseUrl+'ReInsuranceTreatySetUp/GetTreatyReInsuranceAndBrokerAndPeriods?treatyName='+treatyName,this.httpOptions)
  }

  // GetAllReInsurance(type:any){
  //   return this._HttpClient.get(this.baseUrl+'ReInsuranceModels/GetAllReInsurance?type='+type,this.httpOptions)
  // }
  GetAllReInsuranceCompanies(){
    return this._HttpClient.get(this.baseUrl+'CompanyAndBroker/GetAllReInsuranceCompanies',this.httpOptions)
  }
  GetAllReInsuranceBrokers(){
    return this._HttpClient.get(this.baseUrl+'CompanyAndBroker/GetAllReInsuranceBrokers',this.httpOptions)
  }
  GetAllQuarters(){
    return this._HttpClient.get(this.baseUrl+'PolicyReInsurance/ReInsuranceAvailablePeriods',this.httpOptions)
  }
  GetAllProducts(){
    return this._HttpClient.get(this.baseUrl+'Product/GetAllProducts',this.httpOptions)
  }
  // getAllLayerRiskType
  getAllLayerRiskType (){
    return this._HttpClient.get(this.baseUrl+'Product/getAllLayerRiskType',this.httpOptions)
  }
  // get pdf
  H:any
  ReInsuranceCalculationPdf(type:string,body:any){
    if(body.type == 'SOA'){

    }
    var Path;
    if(type == 'SOA' && body.type ==1 && body.companyReInsuranceId !=""){
      Path='SOA/CreateSOAForAllTreatyReInsurancePdf'
      this.H ={
        responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}

    }else if(type == 'SOA' && body.type ==2 && body.companyReInsuranceId !=""){
      Path='SOA/CreateSOAForAllTreatyReInsurancePdf'
      this.H ={
        responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}

    }else if(type == 'SOA' && body.companyReInsuranceId ==""){
      Path='SOA/CreateSOAForAllTreatyReInsurancePdf'
      this.H ={
        responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}
    }


    else if(type == 'Borderaeux' && body.type ==1){
      Path='SOA/PolicyBordreouxReport'
      this.H ={
        observe:'response',responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}
    }else if(type == 'Borderaeux' && body.type ==2){
      Path='SOA/PolicyBordreouxReport'
      this.H ={
        observe:'response',responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}
    }else if(type == 'Claims'){
      Path='SOA/ClaimsBordreouxReport'
      this.H ={
        observe:'response',responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}
    }else if(type == 'Outstanding'){
      Path='Outstanding/OutStandingBordreouxReport'
      this.H ={
        observe:'response',responseType: 'blob',headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.token
        }).set("ngrok-skip-browser-warning", "true")}
    }
    return this._HttpClient.put(this.baseUrl+Path,body,this.H)
  }


  SaveReInsuranceCalculation(body:any){
    return this._HttpClient.post(this.baseUrl+'PolicyReInsurance/SaveReInsuranceCalculation?reInsuranceCompanyId='+body.reInsuranceCompanyId+
      '&number='+body.number,null,this.httpOptions)
  }

  GetAllAgencies(){
    return this._HttpClient.get(this.baseUrl+'ReInsuranceModels/GetAllAgencies',this.httpOptions)
  }
  GetAllProductsWithLineOfBussiness(){
    return this._HttpClient.get(this.baseUrl+'Product/GetAllProductsWithLineOfBussiness',this.httpOptions)
  }
  AddTreatySetUP(Model:any){
    return this._HttpClient.post(this.baseUrl+'ReInsuranceTreatySetUp/AddTreatySetUP',Model,this.httpOptions)
  }
  
  PolicyReInsurance(Model:any){
    return this._HttpClient.put(this.baseUrl+'PolicyReInsurance/PolicyReInsurance',Model,this.httpOptions)
  }
        // Add Outstanding
  AddOutstanding(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Outstanding/AddOutstanding',FormData,{responseType:'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
  })
  }

  // Add Treaty
  AddTreaty(Model:any){
    return this._HttpClient.post(this.baseUrl+'Treaty/AddTreaty',Model,{responseType:'text'})
  }
  AddNonProTreaty(Model:any){
    return this._HttpClient.post(this.baseUrl+'Treaty/AddNonPropotionalTreaty',Model,{responseType:'text'})
  }
  
}
