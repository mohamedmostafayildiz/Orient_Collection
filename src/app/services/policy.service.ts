import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from '@fortawesome/fontawesome-svg-core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  token:any = localStorage.getItem("MedicalToken");
      httpOptions:any = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' +this.token
          }).set("ngrok-skip-browser-warning", "true")
  };
  
  baseUrl:any
  constructor(private _HttpClient:HttpClient) {
    if(localStorage.getItem('url')==null){
      this.baseUrl = environment.baseUrl
    }else{
      this.baseUrl = ''
      this.baseUrl = 'https://'+localStorage.getItem('url')
    }
  }

  configGet:any ={headers: new HttpHeaders().set("ngrok-skip-browser-warning", "true")}
  AddOffer(Model:any){
    return this._HttpClient.post(this.baseUrl+'Offer/AddOffer',Model,this.httpOptions)
  }
  AddCustomerFamily(Model:any){
    return this._HttpClient.post(this.baseUrl+'CustomerFamily/addCustomerFamily',Model,this.httpOptions)
  }

  // get  Policy By Id
  getPolicyById(id:any){
    return this._HttpClient.get(this.baseUrl+'Policy/GetById?policyId='+id,this.httpOptions)
  }

  AddCustomizedPlan(Model:any){
    return this._HttpClient.post(this.baseUrl+'Plan/AddCustomizedPlan',Model,this.httpOptions)
  }

  // get  Policy By Id
  getAviliablePlansForCustomer(id:any){
    return this._HttpClient.get(this.baseUrl+'Plan/GetAvailablePlansForCustomer?customerId='+id,this.httpOptions)
  }
  // Assign Plan To Customer
  AssignPlanToCustomer(Model:any){
    return this._HttpClient.post(this.baseUrl+'Plan/AssignPlanToCustomer',Model,this.httpOptions)
  }

  // Assign Plan To Customer Family
  AssignPlanToFamily(Model:any){
    return this._HttpClient.post(this.baseUrl+'CustomerFamily/AssignPlanToFamily',Model,this.httpOptions)
  }

  // get Family Persons By Policy Id
  getFamilyPersonsByPolicyId(policyId:any){
    return this._HttpClient.get(this.baseUrl+'CustomerFamily/GetCustomerFamily?policyId='+policyId,this.httpOptions)
  }

  // Customer Not Have Policy
  getCustomerNotHavePolicy(id:any){
    return this._HttpClient.get(this.baseUrl+'Customers/CustomersNotHavePolicy?typeId='+id,this.httpOptions)
  }

         // Add Plan With File
  AddPlanWithFile(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Plan/AddPlan',FormData,this.httpOptions)
  }
         // Add Plan With File
  AddPlansToOffer(FormData:any){
    return this._HttpClient.post(this.baseUrl+'Plan/AddPlans',FormData,this.httpOptions)
  }
        // Get Group Templete File
  getGroupTempleteFile(){
    return this._HttpClient.get(this.baseUrl+'CustomerGroup/GetGroupTemplateFile',{observe:'response',
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

        // Upload Group File
  UploadGroupFile(offerId:any, FormData:any){
    return this._HttpClient.post(this.baseUrl+'Offer/AddEmployeesFile?offerId='+offerId,FormData,{responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
  })
  }

      /// Get Group Of Poilcy
  getGroupOfPoilcy(id:any){
    return this._HttpClient.get(this.baseUrl+'CustomerGroup/GetGroupOfPoilcy?policyId='+id ,this.httpOptions)
  }

      /// Get Plans Of Poilcy
  getPlansOfPoilcy(id:any){
    return this._HttpClient.get(this.baseUrl+'Plan/GetPlansOfPolicy?policyId='+id,this.httpOptions)
  }

  // Assign Plan To Group
  AssignPlanToGroup(Model:any){
    return this._HttpClient.post(this.baseUrl+'CustomerGroup/AssignPlanToGroup',Model,this.httpOptions)
  }




      // get Calcualtion of Offer
  getOfferCalculations(id:any){
    return this._HttpClient.get(this.baseUrl+'Offer/GetOfferCalculations?offerId='+id,this.httpOptions)
  }
  // get Calcualtion of Offer with taxes
  getOfferCalculationsWithTax(id:any,taxes:any){
    return this._HttpClient.get(this.baseUrl+'Offer/GetOfferCalculations?offerId='+id+'&taxes='+taxes,this.httpOptions)
  }
  






  ///api/Customers/GetListOfTpa
  getListOfTpa(){
    return this._HttpClient.get(this.baseUrl+'Customers/GetListOfTpa',this.httpOptions)
  }
  
  ///  get Plans Of Policy
  getPlansOfPolicy(id:any){
    return this._HttpClient.get(this.baseUrl+'Plan/GetPlansOfOffer?offerId='+id,this.httpOptions)
  }
  

  
  ///  get All Endorsments
  getAllEndorsements(data:any){
    let params = new HttpParams()
    params = params.append('PolicyCode',data?.PolicyCode).append('EndorsementCode',data?.EndorsementCode).append('EndorsementType',data?.EndorsementType)
    .append('From',data?.From).append('To',data?.To)
    return this._HttpClient.get(this.baseUrl+'Endorsement/getAll',{params,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")
})
  }










  ///  Update Offer
  updateOffer(body:any){
    return this._HttpClient.put(this.baseUrl+'Offer/UpdateOffer',body,this.httpOptions)
  }
  
  ///  get Group Of Policy
  getGroupOfPolicy(id:any){
    return this._HttpClient.get(this.baseUrl+'CustomerGroup/GetGroupOfOffer?offerId='+id,this.httpOptions)
  }


      /// get Offer versions
  getOfferVersions(id:any){
    return this._HttpClient.get(this.baseUrl+'Offer/GetOfferVersions?offerId='+id,this.httpOptions)
  }

      /// get Offer versions
  getVersionDetails(id:any, versionNo:any){
    return this._HttpClient.get(this.baseUrl+'Offer/GetOfferById?offerId='+id+'&versionNo='+versionNo,this.httpOptions)
  }
  
  ///  GetListOfIndividualAndCorporate
  GetListOfIndividualAndCorporate(){
    return this._HttpClient.get(this.baseUrl+"customers/GetListOfIndividualAndCorporate",this.httpOptions)
  }






  // get All Offers
  getAllOffers(){
    return this._HttpClient.get(this.baseUrl+'Offer/GetAll',this.httpOptions)
  }
  
      /// get Offer By id
  getOfferById(id:any){
    return this._HttpClient.get(this.baseUrl+'Offer/GetOfferById?offerId='+id,this.httpOptions)
  }





  AddPolicyEntries(id:any,bySubGroup:boolean){
    return this._HttpClient.post(this.baseUrl+'JournalEntry/AddPolicyEntries?policyId='+id+'&bySubGroup='+bySubGroup,null,this.httpOptions)

  }


         // Add Plan With File
  ConvertOfferToPolicy(Body:any){
    return this._HttpClient.post(this.baseUrl+'Policy/ConvertOfferToPolicy',Body,this.httpOptions)
  }
      /// get Policy Calculationns
  getPolicyCalculationns(id:any){
        return this._HttpClient.get(this.baseUrl+'Policy/GetPolicyCalculations?policyId='+id,this.httpOptions)
    }
      /// get Policy Calculations with Fees
  getPolicyCalculationnsWithFees(id:any, taxes:any){
      return this._HttpClient.get(this.baseUrl+'Policy/GetPolicyCalculations?policyId='+id+'&taxes='+taxes,this.httpOptions)
  }

          // Get Policy Group Template File
   GetPolicyGroupTemplateFile(){
    return this._HttpClient.get(this.baseUrl+'Files/GetPolicyGroupTemplateFile',{observe:'response',
    responseType: 'blob',headers: new HttpHeaders({
      'Authorization': 'Bearer ' +this.token
    }).set("ngrok-skip-browser-warning", "true")})
  }

    // get All polices
  getAllPolices(){
    return this._HttpClient.get(this.baseUrl+'Policy/GetAll',this.httpOptions)
  }

    // get The Policy By Id
  getThePolicyById(id:any){
      return this._HttpClient.get(this.baseUrl+'Policy/GetById?policyId='+id,this.httpOptions)
    }

        // Add Policy ReNewal
  ReNewPolicy(Body:any){
    return this._HttpClient.post(this.baseUrl+'Policy/addPolicyRenewal',Body,this.httpOptions)
  }
        // Update Policy Group Premium
  UpdatePolicyGroupPremium(id:any, Body:any){
    return this._HttpClient.put(this.baseUrl+'Policy/UpdatePolicyGroupPremium?policyId='+id,Body,this.httpOptions)
  }
      // Update Policy Group Premium
  UpdatePolicyGroupPremiumEndor(Body:any){
    return this._HttpClient.post(this.baseUrl+'Endorsement/GetEndorsementCalculationWithoutSave',Body,this.httpOptions)
  }
        // Submit Policy
  SubmitPolicy(id:any){
    return this._HttpClient.put(this.baseUrl+'Policy/SubmitPolicy?policyId='+id,'',this.httpOptions)
  }

      //////////////////////=> Branches <=////////////

  // Add Branch
  AddBranch(Body:any){
    return this._HttpClient.post(this.baseUrl+'Branches/Add', Body,this.httpOptions)
  }

  // Add Bank
  AddBank(Body:any){
    return this._HttpClient.post(this.baseUrl+'Bank/AddBank', Body,this.httpOptions)
  }

  // get All Branches
  getAllBranches(){
    return this._HttpClient.get(this.baseUrl+'Branches/GetAll',this.httpOptions)
  }

  // get All Banks
  getAllBanks(){
    return this._HttpClient.get(this.baseUrl+'Bank/GetAllBanks',this.httpOptions)
  }
  GetAllCustomers(){
    return this._HttpClient.get(this.baseUrl+'Customer/GetAllCustomers',this.httpOptions)
  }

  // get Bank By Id
  getBankById(id:any){
    return this._HttpClient.get(this.baseUrl+'Bank/GetBank?BankId='+id,this.httpOptions)
  }

  // Delete Bank By Id
  DeleteBankById(id:any){
    return this._HttpClient.delete(this.baseUrl+'Bank/DeleteBank?BankId='+id,{responseType:'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
})
  }

  UpdateBranches(Body:any){
    return this._HttpClient.put(this.baseUrl+'Branches/Update',Body,this.httpOptions)
  }

  UpdateBank(Body:any){
    return this._HttpClient.put(this.baseUrl+'Bank/UpdateBank',Body,this.httpOptions)
  }

  //////////////////////=> Claims <=////////////
  // Search Policy
  SearchPolicy(data:any){
    let params = new HttpParams()
    params = params.append('Code',data?.Code).append('InsuredName',data?.InsuredName).append('BrokerId',data?.BrokerId)
    .append('UnderWritingYear',data?.UnderWritingYear).append('From',data?.From).append('To',data?.To)
    return this._HttpClient.post(this.baseUrl+'FileClaims/SearchInPolices',null,{params})
  }

  //////////////////////////// Departments/////////////

  // get All Departments
  getAllDepartments(){
    return this._HttpClient.get(this.baseUrl+'Department/GetAllDepartments',this.httpOptions)
  }
   // Add Department
   AddDepartment(Body:any){
    return this._HttpClient.post(this.baseUrl+'Department/AddDepartment?Name='+Body.name, Body,this.httpOptions)
  }
  // Update Department
  UpdateDepartment(Body:any){
    return this._HttpClient.put(this.baseUrl+'Department/EditDepartment?id='+Body.id+'&name='+Body.name,null,this.httpOptions)
  }
  // Delete Department
  DeleteDepartment(Body:any){
    return this._HttpClient.delete(this.baseUrl+'Department/DeleteDepartment?id='+Body,{responseType:'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
})
  }
  //////////////////////////// Governorates/////////////

  // get All Governorates
  getAllGovernorates(){
    return this._HttpClient.get(this.baseUrl+'Governorates/GetAllGovernorates',this.httpOptions)
  }
   // Add Governorates
  AddGovernorates(Body:any){
    return this._HttpClient.post(this.baseUrl+'Governorates/AddGovernorate', Body,this.httpOptions)
  }
  // Update Governorates
  UpdateGovernorates(Body:any){
    return this._HttpClient.put(this.baseUrl+'Governorates/EditGovernorate',Body,this.httpOptions)
  }
  // Delete Governorates
  DeleteGovernorates(id:any){
    return this._HttpClient.delete(this.baseUrl+'Governorates/DeleteGovernorate?id='+id,{responseType:'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.token
      }).set("ngrok-skip-browser-warning", "true")
})
  }
    


}
