import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url:any = localStorage.getItem('url')
  baseUrl:any
  
          t:any = localStorage.getItem("MedicalToken");
          httpOptions:any = {
              headers: new HttpHeaders({
                'Authorization': 'Bearer ' +this.t
              }).set("ngrok-skip-browser-warning", "true")
          };
  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  ConfigPost:any = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  constructor(private _HttpClient:HttpClient){
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }
  //    Add Customer
  AddCustomer(Model:any){ 
    return this._HttpClient.post(this.baseUrl+'Customers/AddCustomer',Model,this.httpOptions)
  }
  //    Edit Customer
  EditCustomer(Model:any){
    return this._HttpClient.put(this.baseUrl+'Customers/EditCustomer',Model,this.httpOptions)
  }
  //    Edit Commission
  EditCommissionToCustomer(Model:any){
    return this._HttpClient.put(this.baseUrl+'Commissions/EditComissionToCustomer',Model,this.httpOptions)
  }
    ///  Get Fees Of Tpa
  getFeesOfTpa(id:number){
  return this._HttpClient.get(this.baseUrl+'TpaFees/GetFeesOfTpa?tpaId='+id ,this.httpOptions)
  }
        /// get Commission Details By Id
  getCommissionDetailsById(id:any){
    return this._HttpClient.get(this.baseUrl+'Commissions/GetByIdIntEnum?id='+id ,this.httpOptions)
  }
        /// get Custoemer By Id
  getCustomerById(id:any){
    return this._HttpClient.get(this.baseUrl+'Customers/GetById?customerId='+id ,this.httpOptions)
  }
      //Get All Customers
  getAllCustomers(id:any){
    if(id==null){
      return this._HttpClient.get(this.baseUrl+'Customers/GetAll' ,this.httpOptions)
    }
    return this._HttpClient.get(this.baseUrl+'Customers/GetAll?TypeId='+id ,this.httpOptions)
  }
  getAllBrokers(){
    return this._HttpClient.get(this.baseUrl+'Broker/GetAllBrokers',this.httpOptions)
  }
  getAllTpA(){
    return this._HttpClient.get(this.baseUrl+'TPA/GetAll',this.httpOptions)
  }
  addCommissionToCustomer(Model:any){
    return this._HttpClient.post(this.baseUrl+'Commissions/AddCommissionToCustomer',Model,this.httpOptions)
  }
  AddCommissionToCustomer(Model:any){
    return this._HttpClient.post(this.baseUrl+'Commissions/AddCommissionToCustomer',Model,this.httpOptions)
  }

        // Add Age To TBA Customer
  addAgeToTpaCustomer(Model:any){
    return this._HttpClient.post(this.baseUrl+'Customers/AddAgeToTpaCustomer',Model,this.httpOptions)
  }

        ////  AddTpaPlan
  AddNewPlan(Model:any){
    return this._HttpClient.post(this.baseUrl+'TpaPlan/AddTpaPlan',Model,this.httpOptions)
  }
        ////  Add benefit to plan
  AddBenefitToPlan(Model:any){
    return this._HttpClient.post(this.baseUrl+'Benefits/AddBenefitToPlan',Model,this.httpOptions)
  }
          /// Buisness Types
  getBusinessTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/getBusinessTypes',this.configGet)
  }
          /// Commission Types
  getCommissionTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/getCommissionTypes',this.httpOptions)
  }
          /// Buisness Types
  getInsuraneClass(){
    return this._HttpClient.get(this.baseUrl+'Lists/getInsuranceClasses',this.configGet)
  }





          /// Customer Types
  getCustomerTypes(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetCustomerTypes',this.httpOptions)
  }
          /// Get All ReInsurers
  GetAllReInsurerCustomer(){
    return this._HttpClient.get(this.baseUrl+'Customers/GetAllReInsurersCustomers',this.httpOptions)
  }
          /// Get Cuntries
  getCountries(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetCounties',this.httpOptions)
  }
          /// get Currency
  getCurrency(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetCurrency',this.httpOptions)
  }
          /// get Currency
  getPaymentWays(){
    return this._HttpClient.get(this.baseUrl+'Lists/GetPaymentWays',this.httpOptions)
  }

        // Add Early Collect
  addEarlyCollect(Model:any){
    return this._HttpClient.post(this.baseUrl+'EarlyCollect/AddEarlyCollect',Model,this.httpOptions)
  }

        //get All Early Collect
  getEarlyCollect(){
    return this._HttpClient.get(this.baseUrl+'EarlyCollect/GetAll',this.httpOptions)
  }

        //get All Early Collect
  AddPriceOfBenefit(Model:any){
    return this._HttpClient.post(this.baseUrl+'Benifits/AddPriceOfBenefit',Model ,this.httpOptions)
  }
        //get All TPA Plans
  getTpaPlans(){
    return this._HttpClient.get(this.baseUrl+'TpaPlan/GetAllTpaPlans',this.httpOptions)
  }
        //get All TPA Plans
  getPlansOfCustomerTpaById(id:any){
    return this._HttpClient.get(this.baseUrl+'TpaPlan/GetPlansOfTpa?customerId='+id,this.httpOptions)
  }
      // get All Commissions
  getAllCommissions(){
    return this._HttpClient.get(this.baseUrl+'Commissions/GetAllBrokerCommissionsWithData',this.httpOptions)
  }
      // get All Commissions
  getBenefitsOfPlan(id:any){
    return this._HttpClient.get(this.baseUrl+'Benefits/GetBenefitsOfPlan?planId='+id,this.httpOptions)
  }
      // get All Commissions
  getCommissionsOfCustomer(id:number){
    return this._HttpClient.get(this.baseUrl+'Commissions/GetCommissionsOfCustomer?id='+id,this.httpOptions)
  }
      // get Ages of TPa
    GetAgesOfTpa(id:number){
    return this._HttpClient.get(this.baseUrl+'Customers/GetAgesOfTpa?customerId='+id,this.httpOptions)
  }
      // get List Of Corporate 
  GetListOfCorporate(){
    return this._HttpClient.get(this.baseUrl+'Customers/GetListOfCorporate',this.httpOptions)
  }

      // /api/TpaFees/GetAllTpaFees
  GetAllTpaFees(){
    return this._HttpClient.get(this.baseUrl+'Commissions/GetAllTPAFees',this.httpOptions)
  }

      // Add File To Customer
  AddFileToCustomer(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Files/AddFilesToCustomer',FormData,this.httpOptions)
  }
//////////////////////////////////
  GetPolicyGroupTemplateFile(){
    return this._HttpClient.get(this.baseUrl+'Files/GetPolicyGroupTemplateFile',this.httpOptions)
  }



  // /api/TpaFees/AddTpaFees
        // Add Age To TBA Customer
  AddTpaFees(Model:any){
    return this._HttpClient.post(this.baseUrl+'TpaFees/AddTpaFees',Model,this.httpOptions)
  }

        // Add Age To TBA Customer
  AddReinsurerData(Model:any){
    return this._HttpClient.post(this.baseUrl+'Customers/AddReInsurerDaTa',Model,this.httpOptions)
  }
        // Add Age To TBA Customer
  EditTpaFees(Model:any){
    return this._HttpClient.put(this.baseUrl+'TpaFees/EditTpaFees',Model,this.httpOptions)
  }

        // Add Files To Customer
  AddFileToCustomerDetails(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Files/UploadCustomerFile',FormData,{responseType: 'text'})
  }
  // Block UnBlock Customer 
  BlockCustomer(Body:any){
    return this._HttpClient.put(this.baseUrl+'Customers/BlockCustomer',Body,this.httpOptions)
  }
  UnBlockCustomer(id:any){
    return this._HttpClient.put(this.baseUrl+'Customers/UnBlockCustomer?customerId='+id,this.httpOptions)
  }
  // Hold UnHold Customer 
  HoldCustomer(Body:any){
    return this._HttpClient.put(this.baseUrl+'Customers/HoldCustomer',Body,this.httpOptions)
  }
  UnHoldCustomer(id:any){
    return this._HttpClient.put(this.baseUrl+'Customers/UnHoldCustomer?customerId='+id,this.httpOptions)
  }

    // All  Risks
    AddRisk(Model:any){ 
      return this._HttpClient.post(this.baseUrl+'Risk/AddRisk',Model,this.httpOptions)
    }
    AddBenfitToCategory(BenfitId:any,CategoryId:any){
      const Model={
        benfitId:BenfitId,
        categoryId:CategoryId
      }
      return this._HttpClient.post(this.baseUrl+'PricingTool/AddBenfitToCategory',Model,this.httpOptions)
  
    }
    GetAllRisks(){
      return this._HttpClient.get(this.baseUrl+'Risk/GetAllRisks',this.httpOptions)
    }
    GetAllCategoriesBenfits(id:any){
      return this._HttpClient.get(this.baseUrl+'PricingTool/GetAllCategoryBenfits?categoryid='+id,this.httpOptions)
    }
    GetCategoryById(id:any){
      return this._HttpClient.get(this.baseUrl+'Risk/GetRiskById?id='+id,this.httpOptions)
    }
    // EditCategory(Body:any){
    //   return this._HttpClient.put(this.baseUrl+'Benfit/EditCategory',Body)
    // }
    EditCategory(Body:any){
      return this._HttpClient.put(this.baseUrl+'Risk/EditRisk',Body)
    }
    DeleteRisk(id:any){
      return this._HttpClient.delete(this.baseUrl+'Risk/DeleteRisk?id='+id, {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' +this.t
        }).set("ngrok-skip-browser-warning", "true"),responseType: 'text'
    })
  }

  // CheckUser(id:any){
  //   return this._HttpClient.get(this.baseUrl+'User/CheckUser?userId='+id)
  // }
  CheckUser(body:any) {
    return this._HttpClient.post(this.baseUrl+'User/CheckUser',body)
  }

  // CheckUser(id: any): Observable<boolean> {
  //   return this._HttpClient.get<boolean>(`${this.baseUrl}User/CheckUser?userId=${id}`);
  // }
}
